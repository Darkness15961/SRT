<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWheelStore } from '@/composables/useWheelStore'

const router = useRouter()
const store = useWheelStore()
const selectedWinner = ref<string | null>(null)
const participantInput = ref('')

// local reactive copy of participants for reliable template updates
const participants = ref<string[]>([])

// keep participants in sync with the shared store entries
watch(() => store.entries.value, (val) => { participants.value = [...val] }, { immediate: true })

// also watch raw entriesText for edge cases
watch(() => store.state.entriesText, () => { participants.value = [...store.entries.value] })

onMounted(() => {
  const savedWinner = window.localStorage.getItem('srt-config-winner')
  if (savedWinner) {
    selectedWinner.value = savedWinner
  }
})

const addParticipant = () => {
  const value = participantInput.value.trim()
  if (!value) return

  const nextEntries = [...participants.value, value]
  store.state.entriesText = nextEntries.join('\n')
  participantInput.value = ''
}

const selectWinner = (participant: string) => {
  selectedWinner.value = participant
  window.localStorage.setItem('srt-config-winner', participant)
}

const syncFromWheel = () => {
  const STORAGE_KEY = 'appsorteos-wheel-v1'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    alert('No hay datos guardados de la ruleta en LocalStorage.')
    return
  }
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.entriesText === 'string') {
      store.state.entriesText = parsed.entriesText
      // participants will update via watchers
      alert('Sincronizado desde la ruleta correctamente.')
    } else {
      alert('Formato inesperado en los datos de la ruleta.')
    }
  } catch (e) {
    console.error(e)
    alert('Error al leer datos de la ruleta desde LocalStorage.')
  }
}

const simulateWinnerData = () => {
  if (!selectedWinner.value) return

  const existingData = window.localStorage.getItem('srt-winners-history')
  const history = existingData ? JSON.parse(existingData) : []

  const newWinnerRecord = {
    id: Date.now(),
    name: selectedWinner.value,
    timestamp: new Date().toISOString(),
    prize: `Premio #${history.length + 1}`,
    spinCount: Math.floor(Math.random() * 100) + 1,
    totalSpins: Math.floor(Math.random() * 500) + 100,
  }

  history.push(newWinnerRecord)
  window.localStorage.setItem('srt-winners-history', JSON.stringify(history))
  window.localStorage.setItem('srt-last-winner', JSON.stringify(newWinnerRecord))

  console.log('Datos simulados agregados al localStorage:', newWinnerRecord)
  alert(`✅ Datos simulados para "${selectedWinner.value}" guardados en localStorage`)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-black text-[#07142d]">Configuración de participantes</h1>
        <p class="mt-2 text-sm text-[#606575]">Gestiona los participantes en vivo y selecciona al ganador final.</p>
      </div>
      <button class="rounded-lg border border-[#d7d8dc] px-4 py-2 font-semibold text-[#07142d]" @click="goHome">
        Volver a la ruleta
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-2xl border border-[#e8e8ea] bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-[#07142d]">Participantes en vivo</h2>
          <div class="flex items-center gap-3">
            <span class="rounded-full bg-[#f7e8f4] px-3 py-1 text-sm font-semibold text-[#d81383]">{{ participants.length }} en lista</span>
            <button class="rounded-lg border border-[#d7d8dc] px-3 py-1 text-sm" @click="syncFromWheel">Sincronizar</button>
          </div>
        </div>

        <div class="mb-4 flex gap-2">
          <input v-model="participantInput" type="text" class="w-full rounded-lg border border-[#d7d8dc] px-3 py-2 outline-none focus:border-[#d81383]" placeholder="Agregar participante" @keyup.enter="addParticipant" />
          <button class="rounded-lg bg-[#d81383] px-4 py-2 font-semibold text-white" @click="addParticipant">Agregar</button>
        </div>

        <ul v-if="participants.length" class="max-h-[420px] space-y-2 overflow-y-auto">
          <li v-for="participant in participants" :key="participant" class="flex items-center justify-between rounded-lg border border-[#ececf1] px-3 py-2">
            <button class="text-left font-medium text-[#07142d]" @click="selectWinner(participant)">{{ participant }}</button>
            <button class="text-sm font-semibold text-[#d81383]" @click="selectWinner(participant)">Elegir ganador</button>
          </li>
        </ul>
        <p v-else class="rounded-lg border border-dashed border-[#d7d8dc] px-4 py-8 text-center text-sm text-[#606575]">Aún no hay participantes. Agrega uno para comenzar.</p>
      </div>

      <div class="rounded-2xl border border-[#e8e8ea] bg-[#f8f9fc] p-5 shadow-sm">
        <h2 class="text-lg font-bold text-[#07142d]">Ganador seleccionado</h2>
        <p class="mt-2 text-sm text-[#606575]">El participante marcado aquí se conservará en el almacenamiento local.</p>

        <div class="mt-5 rounded-xl border border-[#d7d8dc] bg-white p-4">
          <p v-if="selectedWinner" class="cursor-pointer text-xl font-black text-[#07142d] transition-colors hover:text-[#d81383]" @click="simulateWinnerData">{{ selectedWinner }}</p>
          <p v-else class="text-sm text-[#606575]">Todavía no has seleccionado un ganador.</p>
          <p v-if="selectedWinner" class="mt-3 text-xs text-[#999aaa]">Haz click en el nombre para simular datos en localStorage</p>
        </div>
      </div>
    </div>
  </section>
</template>
