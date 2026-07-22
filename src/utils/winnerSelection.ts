export const CONFIRMED_WINNER_KEY = 'srt-confirmed-winner'
export const EXCLUDED_NAMES_KEY = 'srt-excluded-names'

export interface ConfirmedWinner {
  name: string
  confirmedAt: string
}

export function readConfirmedWinner(): ConfirmedWinner | null {
  try {
    const raw = window.localStorage.getItem(CONFIRMED_WINNER_KEY)
    if (!raw) return null

    const value = JSON.parse(raw) as Partial<ConfirmedWinner>
    return typeof value.name === 'string' && value.name.trim()
      ? { name: value.name, confirmedAt: value.confirmedAt ?? '' }
      : null
  } catch {
    return null
  }
}

export function confirmWinner(name: string) {
  const winner: ConfirmedWinner = { name, confirmedAt: new Date().toISOString() }
  window.localStorage.setItem(CONFIRMED_WINNER_KEY, JSON.stringify(winner))
}

export function clearConfirmedWinner() {
  window.localStorage.removeItem(CONFIRMED_WINNER_KEY)
}

export function readExcludedNames(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(EXCLUDED_NAMES_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter(name => typeof name === 'string') : []
  } catch {
    return []
  }
}

export function saveExcludedNames(names: string[]) {
  window.localStorage.setItem(EXCLUDED_NAMES_KEY, JSON.stringify([...new Set(names)]))
}
