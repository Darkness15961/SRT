import { computed, reactive, watch } from 'vue'

export type WheelMode = 'classic' | 'register'
export interface SavedWheel { id: number; name: string; entries: string[]; palette: number; mode: WheelMode }
export interface WheelState { mode: WheelMode; entriesText: string; palette: number; advanced: boolean; saved: SavedWheel[] }

const defaultEntries = ['Paris','Singapur','Roma','Berlín','Washington','Buenos Aires','Lima','Tokio','Estocolmo','Bangkok','Madrid','Londres','Montevideo','Pekín','Santo Domingo']
const STORAGE_KEY = 'appsorteos-wheel-v1'
const readState = (): WheelState => {
  try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) return { ...JSON.parse(saved) } }
  catch { /* use defaults */ }
  return { mode: 'classic', entriesText: defaultEntries.join('\n'), palette: 0, advanced: false, saved: [] }
}
const state = reactive<WheelState>(readState())
let initialized = false

export function useWheelStore() {
  const entries = computed(() => state.entriesText.split('\n').map(v => v.trim()).filter(Boolean))
  if (!initialized) { watch(state, value => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true }); initialized = true }
  const sort = () => { state.entriesText = [...entries.value].sort((a,b) => a.localeCompare(b)).join('\n') }
  const shuffle = () => { const a = [...entries.value]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); const v=a[i]!; a[i]=a[j]!; a[j]=v} state.entriesText=a.join('\n') }
  const clear = () => { state.entriesText = '' }
  const removeEntry = (index: number) => {
    const list = [...entries.value]
    list.splice(index, 1)
    state.entriesText = list.join('\n')
  }
  const save = () => { state.saved.push({ id: Date.now(), name: `Mi Ruleta ${state.saved.length + 1}`, entries: [...entries.value], palette: state.palette, mode: state.mode }) }
  const load = (wheel: SavedWheel) => { state.entriesText=wheel.entries.join('\n'); state.palette=wheel.palette; state.mode=wheel.mode }
  const remove = (id: number) => { state.saved = state.saved.filter(w => w.id !== id) }
  return { state, entries, sort, shuffle, clear, removeEntry, save, load, remove }
}
export type WheelStore = ReturnType<typeof useWheelStore>
