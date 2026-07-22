<script setup lang="ts">
import { ref } from 'vue'
import type { WheelStore } from '@/composables/useWheelStore'
import { useWheelBus } from '@/composables/useWheelBus'
import Icon from './UiIcon.vue'

const props = defineProps<{ store: WheelStore }>()
const { emitSpin } = useWheelBus()

const saveLabel = ref('Guardar')
const mobileSaveLabel = ref('Guardar')
const openPanels = ref<Record<string, boolean>>({ options: false, design: false })

const startWheel = () => emitSpin()

const confirmClear = () => {
  if (!props.store.entries.value.length) return
  if (window.confirm('¿Estás seguro de que deseas limpiar todas las entradas?')) {
    props.store.clear()
  }
}

const flashSaveButton = (target: 'desktop' | 'mobile') => {
  props.store.save()
  const label = target === 'desktop' ? saveLabel : mobileSaveLabel
  label.value = '✓ Guardado'
  setTimeout(() => { label.value = 'Guardar' }, 1500)
}

const togglePanel = (key: string) => {
  openPanels.value[key] = !openPanels.value[key]
}
</script>

<template>
  <aside class="overflow-hidden rounded border border-[#d7d8dc] bg-white lg:h-[600px]">
    <div class="grid grid-cols-3 lg:hidden">
      <button class="mobile-tab"><i class="fa-solid fa-gear text-[22px]"></i><span>Opciones</span></button>
      <button class="mobile-tab"><i class="fa-solid fa-gift text-[22px]"></i><span>Entradas</span></button>
      <button class="mobile-tab"><i class="fa-solid fa-palette text-[22px]"></i><span>Diseño</span></button>
    </div>
    <div class="grid grid-cols-2 gap-2 border-t border-[#ddd] p-3 lg:hidden">
      <button class="rounded-lg bg-[#df0c86] py-4 font-bold text-white transition-colors" @click="flashSaveButton('mobile')">{{ mobileSaveLabel }}</button>
      <button class="flex items-center justify-center gap-1 rounded-lg bg-[#51c508] py-4 font-bold text-white" @click="startWheel"><Icon name="play" :size="18" />Comenzar</button>
    </div>
    <div class="hidden h-full flex-col lg:flex">
    <!-- Collapsible panels: Opciones & Diseño -->
    <div v-for="row in [{key:'options',icon:'fa-gear',label:'Opciones'},{key:'design',icon:'fa-palette',label:'Diseño'}]" :key="row.key">
      <button class="flex h-[54px] shrink-0 w-full items-center gap-5 border-b border-[#d7d8dc] bg-gradient-to-b from-white to-[#f0eff7] px-5 font-bold" @click="togglePanel(row.key)">
        <i class="fa-solid w-[22px] text-center text-[20px]" :class="row.icon"></i><span>{{ row.label }}</span>
        <Icon :name="openPanels[row.key] ? 'chevron-down' : 'right'" class="ml-auto text-[#838894]" :size="20" />
      </button>
      <div v-if="openPanels[row.key]" class="border-b border-[#d7d8dc] px-5 py-4 text-[13px] text-[#777b88]">
        <p>Próximamente — esta sección está en desarrollo.</p>
      </div>
    </div>
    <div class="flex h-[54px] shrink-0 items-center gap-5 border-b border-[#d7d8dc] bg-gradient-to-b from-white to-[#eceaf4] px-5 font-bold">
      <i class="fa-solid fa-gift w-[22px] text-center text-[20px]"></i><span>Entradas <span class="text-[#666974]">({{ store.entries.value.length }})</span></span><Icon name="chevron-down" class="ml-auto text-[#77808e]" :size="18" />
    </div>
    <div class="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-5">
      <div class="grid grid-cols-3 gap-2">
        <button class="side-tool" @click="store.sort"><i class="fa-solid fa-arrow-down-a-z"></i>Ordenar</button>
        <button class="side-tool" @click="store.shuffle"><i class="fa-solid fa-shuffle"></i>Mezclar</button>
        <button class="side-tool" @click="confirmClear"><i class="fa-regular fa-trash-can"></i>Limpiar</button>
      </div>
      <label class="my-4 flex items-center gap-2 text-[14px]"><input v-model="store.state.advanced" type="checkbox" class="size-4 accent-[#dd1184]"> Avanzado</label>
      <!-- Advanced mode: raw textarea -->
      <textarea v-if="store.state.advanced" v-model="store.state.entriesText" class="participants-input min-h-0 w-full flex-1 resize-none overflow-y-auto rounded-lg border border-[#b9bdc5] p-3 text-[14px] leading-[1.5] text-[#364052] transition-colors focus:border-[#e51188]"></textarea>
      <!-- Simple mode: list with individual delete -->
      <ul v-else class="min-h-0 flex-1 space-y-1 overflow-y-auto">
        <li v-for="(entry, index) in store.entries.value" :key="`${entry}-${index}`" class="flex items-center justify-between rounded border border-[#e8e8ea] px-3 py-1.5 text-[14px] text-[#364052]">
          <span class="min-w-0 truncate">{{ entry }}</span>
          <button class="ml-2 shrink-0 text-[#9ca0ab] transition-colors hover:text-[#d81383]" title="Eliminar" aria-label="Eliminar participante" @click="store.removeEntry(index)">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </li>
        <li v-if="!store.entries.value.length" class="py-6 text-center text-[13px] text-[#9ca0ab]">Sin participantes</li>
      </ul>
    </div>
    <div class="grid shrink-0 grid-cols-2 gap-2 border-t border-[#d7d8dc] p-3">
      <button class="rounded-lg bg-[#df0c86] py-3 font-bold text-white transition-colors" @click="flashSaveButton('desktop')">{{ saveLabel }}</button>
      <button class="flex items-center justify-center gap-1 rounded-lg bg-[#51c508] py-3 font-bold text-white" @click="startWheel"><i class="fa-solid fa-play"></i>Comenzar</button>
    </div>
    </div>
  </aside>
</template>

<style scoped>
.side-tool {
  display: flex;
  height: 50px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  background: #d5d9e0;
  color: #000;
  font-size: 12px;
  transition: 0.2s;
}
.side-tool:hover {
  background: #cbd0d8;
}
.mobile-tab {
  display: flex;
  height: 68px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #92969e;
  font-size: 13px;
}
.participants-input:focus,
.participants-input:focus-visible {
  outline: none;
  box-shadow: none;
}
</style>
