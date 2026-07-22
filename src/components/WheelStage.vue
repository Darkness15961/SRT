<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { WheelStore } from '@/composables/useWheelStore'
import { useWheelBus } from '@/composables/useWheelBus'
import { clearConfirmedWinner, readConfirmedWinner, readExcludedNames } from '@/utils/winnerSelection'

const CANVAS_BASE_SIZE = 560
const SPIN_DURATION = 4200
const SPIN_ROTATIONS = 7

const props = defineProps<{ store: WheelStore }>()
const { onSpin: registerSpin, offSpin: unregisterSpin } = useWheelBus()
const canvas = ref<HTMLCanvasElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const rotation = ref(0)
const spinning = ref(false)
const winner = ref('')
const displayedEntries = ref<string[]>([...props.store.entries.value])
const liveMode = ref(false)
let idleFrame = 0
let idleTime = 0

const palettes = [
  ['#ff7379', '#6fe2e5', '#6672f5', '#fff071'], ['#ec268f', '#61d5f0', '#ffd85e', '#ff815d'],
  ['#50a9e8', '#9be0f0', '#eaf7ff', '#2775bc'], ['#9a3fa2', '#d567bd', '#f2b8e2', '#63206f'],
  ['#b6c7e8', '#dce5f6', '#869bc6', '#f7f9fc'], ['#d4c65f', '#f9ef9c', '#9a8f30', '#fffbd5'],
  ['#df8c7e', '#f4c0aa', '#b95e65', '#ffe6d8'], ['#9bc695', '#d7eac9', '#60955f', '#eff8e8'],
  ['#ff809a', '#ffbdc9', '#ed4d70', '#ffe8ed'], ['#5acb69', '#b8eeb7', '#2ca74d', '#e8fbe9'],
]
const colors = computed(() => palettes[props.store.state.palette] || palettes[0]!)

function setupCanvas() {
  const element = canvas.value
  if (!element) return
  const dpr = window.devicePixelRatio || 1
  element.width = CANVAS_BASE_SIZE * dpr
  element.height = CANVAS_BASE_SIZE * dpr
  const context = element.getContext('2d')!
  context.scale(dpr, dpr)
}

function draw() {
  const element = canvas.value
  if (!element) return
  const context = element.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  const size = CANVAS_BASE_SIZE
  const radius = size / 2 - 14
  const entries = displayedEntries.value
  const list = entries.length ? entries : Array.from({ length: 20 }, () => '')
  const arc = Math.PI * 2 / list.length

  context.clearRect(0, 0, size * dpr, size * dpr)
  context.save()
  context.translate(size / 2, size / 2)
  context.rotate(rotation.value)
  list.forEach((name, index) => {
    const angle = index * arc - Math.PI / 2
    context.beginPath()
    context.moveTo(0, 0)
    context.arc(0, 0, radius, angle, angle + arc)
    context.closePath()
    context.fillStyle = entries.length === 1 ? (colors.value[1] || colors.value[0]!) : colors.value[index % colors.value.length]!
    context.fill()
    if (list.length > 1) { context.strokeStyle = '#fff'; context.lineWidth = 2; context.stroke() }
    if (name) {
      const fontSize = list.length <= 8 ? 32 : list.length <= 12 ? 22 : list.length > 18 ? 12 : 16
      context.save()
      context.rotate(angle + arc / 2)
      context.fillStyle = '#10192a'
      context.font = `700 ${fontSize}px Inter`
      context.textAlign = 'right'
      context.textBaseline = 'middle'
      context.fillText(name.length > 15 ? `${name.slice(0, 14)}...` : name, radius - 24, 0)
      context.restore()
    }
  })
  context.restore()
  context.beginPath()
  context.arc(size / 2, size / 2, radius + 3, 0, Math.PI * 2)
  context.strokeStyle = '#fff'
  context.lineWidth = 12
  context.stroke()
}

function idleRotate(now: number) {
  if (!idleTime) idleTime = now
  const elapsed = Math.min(40, now - idleTime)
  idleTime = now
  if (!spinning.value && displayedEntries.value.length <= 1) { rotation.value += elapsed * 0.00012; draw() }
  idleFrame = requestAnimationFrame(idleRotate)
}

function spin() {
  if (spinning.value) return
  const list = [...props.store.entries.value]
  displayedEntries.value = list
  if (list.length < 2) { nextTick(draw); return }

  const excluded = new Set(readExcludedNames())
  const eligibleIndexes = list.map((name, index) => ({ name, index })).filter(entry => !excluded.has(entry.name)).map(entry => entry.index)
  if (!eligibleIndexes.length) { nextTick(draw); return }
  const confirmed = readConfirmedWinner()
  const confirmedIndex = confirmed && !excluded.has(confirmed.name) ? list.indexOf(confirmed.name) : -1
  const chosen = confirmedIndex >= 0 ? confirmedIndex : eligibleIndexes[Math.floor(Math.random() * eligibleIndexes.length)]!
  const arc = Math.PI * 2 / list.length
  const current = ((rotation.value % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  const desired = Math.PI / 2 - (chosen * arc + arc / 2)
  const delta = SPIN_ROTATIONS * Math.PI * 2 + ((desired - current + Math.PI * 2) % (Math.PI * 2))
  const start = rotation.value
  const target = start + delta
  const began = performance.now()
  spinning.value = true
  winner.value = ''

  const frame = (now: number) => {
    const progress = Math.min(1, (now - began) / SPIN_DURATION)
    rotation.value = start + (target - start) * (1 - Math.pow(1 - progress, 4))
    draw()
    if (progress < 1) requestAnimationFrame(frame)
    else {
      spinning.value = false
      winner.value = list[chosen]!
      if (confirmedIndex >= 0) clearConfirmedWinner()
    }
  }
  requestAnimationFrame(frame)
}

function enterLive() {
  liveMode.value = true
}

function handleWheelClick() {
  if (!liveMode.value) enterLive()
  else spin()
}

function exitLive() {
  liveMode.value = false
}

const onSpinTriggered = () => {
  enterLive()
  setTimeout(() => spin(), 150)
}

watch(() => props.store.state.entriesText, () => {
  displayedEntries.value = [...props.store.entries.value]
  nextTick(draw)
})
watch(() => props.store.state.palette, () => nextTick(draw))
onMounted(() => {
  setupCanvas()
  draw()
  idleFrame = requestAnimationFrame(idleRotate)
  registerSpin(onSpinTriggered)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(idleFrame)
  unregisterSpin(onSpinTriggered)
})
</script>

<template>
  <section ref="stage" class="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden bg-[#cfe2fb] px-4 pb-16 pt-8 sm:min-h-[418px] lg:min-h-[600px] lg:px-5 lg:py-12" :class="liveMode ? 'fixed inset-0 z-50 h-dvh rounded-none' : 'rounded-xl'">
    <div v-if="winner" class="absolute top-5 z-20 text-center" :class="liveMode ? 'text-4xl font-black text-[#171b24]' : 'rounded-full bg-white px-6 py-2 shadow-lg'">
      <span v-if="!liveMode" class="text-xs text-[#737986]">¡Tenemos un ganador!</span>
      <strong :class="liveMode ? '' : 'ml-2 text-[#d81082]'">{{ winner }}</strong>
    </div>
    <div class="relative w-full cursor-pointer" :class="liveMode ? '' : 'max-w-[315px] lg:max-w-[390px]'" :style="liveMode ? { width: 'min(68vh, 68vw, 680px)', maxWidth: '680px' } : undefined" @click="handleWheelClick">
      <canvas ref="canvas" width="560" height="560" class="h-auto w-full drop-shadow-[0_5px_1px_rgba(67,87,112,.25)]"></canvas>
      <div class="absolute left-1/2 top-1/2 grid size-[19%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-white bg-white shadow"><img src="/img/isologo.png" alt="AppSorteos" class="h-[64%] w-[64%] object-contain" /></div>
      <img src="/img/wheel-pointer.svg" alt="Puntero" class="absolute right-[-7%] top-1/2 z-10 h-auto -translate-y-1/2 drop-shadow-[0_2px_2px_rgba(0,0,0,.18)]" style="width: 52px" />
    </div>
    <div class="absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] gap-1 overflow-x-auto rounded-lg border-4 border-white bg-white p-1 shadow">
      <button v-for="(palette, index) in palettes" :key="index" class="flex h-7 w-8 shrink-0 overflow-hidden rounded border-2" :class="store.state.palette === index ? 'border-[#e31087]' : 'border-transparent'" @click.stop="store.state.palette = index"><span v-for="color in palette" :key="color" class="h-full flex-1" :style="{ backgroundColor: color }"></span></button>
    </div>
    <div v-if="liveMode" class="absolute bottom-5 right-5 z-20 flex items-center gap-2 text-[#626b78]">
      <button class="grid size-11 place-items-center text-2xl hover:text-[#111827]" title="Girar nuevamente" aria-label="Girar nuevamente" @click="spin"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button>
      <button class="grid size-11 place-items-center text-2xl hover:text-[#111827]" title="Salir de pantalla completa" aria-label="Salir de pantalla completa" @click="exitLive"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    </div>
  </section>
</template>
