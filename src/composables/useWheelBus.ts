import { ref } from 'vue'

type SpinCallback = () => void

const listeners = ref<Set<SpinCallback>>(new Set())

export function useWheelBus() {
  const onSpin = (callback: SpinCallback) => {
    listeners.value.add(callback)
  }

  const offSpin = (callback: SpinCallback) => {
    listeners.value.delete(callback)
  }

  const emitSpin = () => {
    listeners.value.forEach((callback) => callback())
  }

  return { onSpin, offSpin, emitSpin }
}
