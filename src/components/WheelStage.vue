<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { WheelStore } from '@/composables/useWheelStore'
const props = defineProps<{ store: WheelStore }>()
const canvas = ref<HTMLCanvasElement|null>(null), rotation=ref(0), spinning=ref(false), winner=ref('')
let idleFrame = 0
let idleTime = 0
const palettes = [
  ['#ff7379','#6fe2e5','#6672f5','#fff071'], ['#ec268f','#61d5f0','#ffd85e','#ff815d'], ['#50a9e8','#9be0f0','#eaf7ff','#2775bc'], ['#9a3fa2','#d567bd','#f2b8e2','#63206f'], ['#b6c7e8','#dce5f6','#869bc6','#f7f9fc'], ['#d4c65f','#f9ef9c','#9a8f30','#fffbd5'], ['#df8c7e','#f4c0aa','#b95e65','#ffe6d8'], ['#9bc695','#d7eac9','#60955f','#eff8e8'], ['#ff809a','#ffbdc9','#ed4d70','#ffe8ed'], ['#5acb69','#b8eeb7','#2ca74d','#e8fbe9']
]
const colors = computed(()=>palettes[props.store.state.palette] || palettes[0]!)
function draw(){
  const el=canvas.value;if(!el)return
  const c=el.getContext('2d')!,s=el.width,r=s/2-14,entries=props.store.entries.value
  const isEmpty=entries.length===0
  const list=isEmpty?Array.from({length:20},()=> ''):entries
  const arc=Math.PI*2/list.length
  c.clearRect(0,0,s,s);c.save();c.translate(s/2,s/2);c.rotate(rotation.value)
  list.forEach((name,i)=>{
    const a=i*arc-Math.PI/2
    c.beginPath();c.moveTo(0,0);c.arc(0,0,r,a,a+arc);c.closePath()
    c.fillStyle=entries.length===1 ? (colors.value[1] || colors.value[0]!) : colors.value[i%colors.value.length]!;c.fill()
    if(list.length>1){c.strokeStyle='#fff';c.lineWidth=2;c.stroke()}
    if(name){
      const fontSize=list.length<=8?32:list.length<=12?22:list.length>18?12:16
      c.save();c.rotate(a+arc/2);c.fillStyle='#10192a';c.font=`700 ${fontSize}px Inter`;c.textAlign='right';c.textBaseline='middle'
      c.fillText(name.length>15?name.slice(0,14)+'…':name,r-24,0);c.restore()
    }
  })
  c.restore();c.beginPath();c.arc(s/2,s/2,r+3,0,Math.PI*2);c.strokeStyle='#fff';c.lineWidth=12;c.stroke()
}
function idleRotate(now:number){
  if(!idleTime)idleTime=now
  const elapsed=Math.min(40,now-idleTime);idleTime=now
  if(!spinning.value&&props.store.entries.value.length<=1){rotation.value+=elapsed*0.00012;draw()}
  idleFrame=requestAnimationFrame(idleRotate)
}
function spin(){if(spinning.value||props.store.entries.value.length<2)return;spinning.value=true;winner.value='';const list=props.store.entries.value,chosen=Math.floor(Math.random()*list.length),arc=Math.PI*2/list.length,current=((rotation.value%(Math.PI*2))+Math.PI*2)%(Math.PI*2),desired=-(chosen*arc+arc/2),delta=7*Math.PI*2+((desired-current+Math.PI*2)%(Math.PI*2)),start=rotation.value,target=start+delta,began=performance.now();const frame=(now:number)=>{const p=Math.min(1,(now-began)/4200),ease=1-Math.pow(1-p,4);rotation.value=start+(target-start)*ease;draw();if(p<1)requestAnimationFrame(frame);else{spinning.value=false;winner.value=list[chosen]!}};requestAnimationFrame(frame)}
const onSpin=()=>spin()
watch([()=>props.store.state.entriesText,()=>props.store.state.palette],()=>nextTick(draw))
onMounted(()=>{draw();idleFrame=requestAnimationFrame(idleRotate);window.addEventListener('wheel:spin',onSpin)})
onBeforeUnmount(()=>{cancelAnimationFrame(idleFrame);window.removeEventListener('wheel:spin',onSpin)})
</script>

<template>
  <section class="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-xl bg-[#cfe2fb] px-4 pb-16 pt-8 sm:min-h-[418px] lg:min-h-[600px] lg:px-5 lg:py-12">
    <div v-if="winner" class="absolute top-5 z-20 rounded-full bg-white px-6 py-2 text-center shadow-lg"><span class="text-xs text-[#737986]">¡Tenemos un ganador!</span><strong class="ml-2 text-[#d81082]">{{ winner }}</strong></div>
    <div class="relative w-full max-w-[315px] cursor-pointer lg:max-w-[390px]" @click="spin">
      <canvas ref="canvas" width="560" height="560" class="h-auto w-full drop-shadow-[0_5px_1px_rgba(67,87,112,.25)]"></canvas>
      <div class="absolute left-1/2 top-1/2 grid size-[19%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-white bg-white shadow"><img src="/img/isologo.png" alt="AppSorteos" class="h-[64%] w-[64%] object-contain" /></div>
      <img src="/img/wheel-pointer.svg" alt="Puntero" class="absolute right-[1%] top-[5%] z-10 w-[58px] -translate-y-1/2 -rotate-45 drop-shadow-[0_2px_2px_rgba(0,0,0,.18)] lg:right-[-7%] lg:top-1/2 lg:w-[52px] lg:-rotate-0" />
    </div>
    <div class="absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] gap-1 overflow-x-auto rounded-lg border-4 border-white bg-white p-1 shadow">
      <button v-for="(palette,i) in palettes" :key="i" class="flex h-7 w-8 shrink-0 overflow-hidden rounded border-2" :class="store.state.palette===i?'border-[#e31087]':'border-transparent'" @click="store.state.palette=i"><span v-for="color in palette" :key="color" class="h-full flex-1" :style="{backgroundColor:color}"></span></button>
    </div>
  </section>
</template>
