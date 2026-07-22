<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWheelStore } from '@/composables/useWheelStore'
import { clearConfirmedWinner, confirmWinner, readConfirmedWinner, readExcludedNames, saveExcludedNames } from '@/utils/winnerSelection'

const router = useRouter()
const store = useWheelStore()
const selectedWinner = ref<string | null>(null)
const participantInput = ref('')
const searchQuery = ref('')
const isSubmitting = ref(false)
const participants = ref<string[]>([])
const excludedNames = ref<string[]>(readExcludedNames())

const normalizeText = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()

const filteredParticipants = computed(() => {
  const query = normalizeText(searchQuery.value.trim())
  if (!query) return participants.value
  return participants.value.filter(participant => normalizeText(participant).includes(query))
})

watch(() => store.entries.value, (value) => {
  participants.value = [...value]
  if (selectedWinner.value && !value.includes(selectedWinner.value)) selectedWinner.value = null
  const activeExclusions = excludedNames.value.filter(name => value.includes(name))
  if (activeExclusions.length !== excludedNames.value.length) {
    excludedNames.value = activeExclusions
    saveExcludedNames(activeExclusions)
  }
}, { immediate: true })

onMounted(() => {
  const confirmedWinner = readConfirmedWinner()
  if (confirmedWinner && store.entries.value.includes(confirmedWinner.name)) {
    selectedWinner.value = confirmedWinner.name
  }
})

const addParticipant = () => {
  const value = participantInput.value.trim()
  if (!value) return
  store.state.entriesText = [...participants.value, value].join('\n')
  participantInput.value = ''
}

const isExcluded = (participant: string) => excludedNames.value.includes(participant)

const selectWinner = (participant: string) => {
  if (!isExcluded(participant)) selectedWinner.value = participant
}

const toggleExcluded = (participant: string) => {
  if (isExcluded(participant)) {
    excludedNames.value = excludedNames.value.filter(name => name !== participant)
  } else {
    excludedNames.value = [...excludedNames.value, participant]
    if (selectedWinner.value === participant) selectedWinner.value = null
    const confirmed = readConfirmedWinner()
    if (confirmed?.name === participant) clearConfirmedWinner()
  }
  saveExcludedNames(excludedNames.value)
}

const syncFromWheel = () => {
  const raw = window.localStorage.getItem('appsorteos-wheel-v1')
  if (!raw) return alert('No hay datos guardados de la ruleta en LocalStorage.')
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.entriesText === 'string') {
      store.state.entriesText = parsed.entriesText
      alert('Sincronizado desde la ruleta correctamente.')
    } else alert('Formato inesperado en los datos de la ruleta.')
  } catch {
    alert('Error al leer datos de la ruleta desde LocalStorage.')
  }
}

const submitWinner = async () => {
  if (!selectedWinner.value || !participants.value.includes(selectedWinner.value) || isExcluded(selectedWinner.value)) return
  isSubmitting.value = true
  confirmWinner(selectedWinner.value)
  await router.push('/')
}

const goHome = () => { router.push('/') }
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-black text-[#07142d]">Configuración de participantes</h1>
        <p class="mt-2 text-sm text-[#606575]">Gestiona los participantes en vivo y selecciona al ganador final.</p>
      </div>
      <button class="rounded-lg border border-[#d7d8dc] px-4 py-2 font-semibold text-[#07142d]" @click="goHome">Volver a la ruleta</button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-lg border border-[#e8e8ea] bg-white p-5 shadow-sm">
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

        <div class="relative mb-4">
          <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#858995]" aria-hidden="true"></i>
          <input v-model="searchQuery" type="search" class="w-full rounded-lg border border-[#d7d8dc] py-2 pl-9 pr-9 outline-none focus:border-[#d81383]" placeholder="Buscar participante por nombre" aria-label="Buscar participante por nombre" />
          <button v-if="searchQuery" type="button" class="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center text-[#777b88] hover:text-[#07142d]" title="Limpiar búsqueda" aria-label="Limpiar búsqueda" @click="searchQuery = ''">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <ul v-if="filteredParticipants.length" class="max-h-[420px] space-y-2 overflow-y-auto">
          <li v-for="(participant, index) in filteredParticipants" :key="`${participant}-${index}`" class="flex items-center justify-between gap-3 rounded-lg border px-3 py-2" :class="isExcluded(participant) ? 'border-[#d7d8dc] bg-[#f1f2f4]' : selectedWinner === participant ? 'border-[#d81383] bg-[#fff5fb]' : 'border-[#ececf1]'">
            <button class="min-w-0 flex-1 truncate text-left font-medium" :class="isExcluded(participant) ? 'text-[#8a8e98] line-through' : 'text-[#07142d]'" :disabled="isExcluded(participant)" @click="selectWinner(participant)">{{ participant }}</button>
            <div class="flex shrink-0 items-center gap-3">
              <button v-if="!isExcluded(participant)" class="text-sm font-semibold text-[#d81383]" @click="selectWinner(participant)">{{ selectedWinner === participant ? 'Seleccionado' : 'Elegir ganador' }}</button>
              <button class="text-sm font-semibold" :class="isExcluded(participant) ? 'text-[#18814b]' : 'text-[#777b88]'" @click="toggleExcluded(participant)">
                <i class="fa-solid" :class="isExcluded(participant) ? 'fa-rotate-left' : 'fa-ban'" aria-hidden="true"></i>
                {{ isExcluded(participant) ? 'Incluir' : 'Excluir' }}
              </button>
            </div>
          </li>
        </ul>
        <p v-else-if="searchQuery" class="rounded-lg border border-dashed border-[#d7d8dc] px-4 py-8 text-center text-sm text-[#606575]">No se encontraron participantes con “{{ searchQuery }}”.</p>
        <p v-else class="rounded-lg border border-dashed border-[#d7d8dc] px-4 py-8 text-center text-sm text-[#606575]">Aún no hay participantes. Agrega uno para comenzar.</p>
      </div>

      <div class="rounded-lg border border-[#e8e8ea] bg-[#f8f9fc] p-5 shadow-sm">
        <h2 class="text-lg font-bold text-[#07142d]">Ganador seleccionado</h2>
        <p class="mt-2 text-sm text-[#606575]">Confirma el participante que debe ganar el próximo giro en vivo.</p>
        <div class="mt-5 rounded-lg border border-[#d7d8dc] bg-white p-4">
          <button v-if="selectedWinner" class="text-left text-xl font-black text-[#07142d] transition-colors hover:text-[#d81383]" @click="submitWinner">{{ selectedWinner }}</button>
          <p v-else class="text-sm text-[#606575]">Todavía no has seleccionado un ganador.</p>
          <button v-if="selectedWinner" class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d81383] px-4 py-2.5 font-bold text-white transition-colors hover:bg-[#b90f70] disabled:cursor-wait disabled:opacity-60" :disabled="isSubmitting" @click="submitWinner">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
            {{ isSubmitting ? 'Enviando...' : 'Enviar a la ruleta' }}
          </button>
          <p v-if="selectedWinner" class="mt-3 text-xs text-[#777b88]">Al enviar, el próximo giro se detendrá en este ganador.</p>
        </div>
      </div>
    </div>
  </section>
</template>
