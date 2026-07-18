<script setup lang="ts">
defineProps<{ name: string; size?: number; strokeWidth?: number }>()
const paths: Record<string, string[]> = {
  grid: ['M4 4h6v6H4z','M14 4h6v6h-6z','M4 14h6v6H4z','M14 14h6v6h-6z'],
  'chevron-down': ['m6 9 6 6 6-6'], right: ['m9 18 6-6-6-6'], check: ['m5 12 4 4L19 7'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z','M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-3v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.56-1.03H5v-3h.08A1.7 1.7 0 0 0 6.64 10 1.7 1.7 0 0 0 6.3 8.12l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 10.3 6.34 1.7 1.7 0 0 0 11.33 4.8V4h3v.08A1.7 1.7 0 0 0 15.36 5.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.7 9.3a1.7 1.7 0 0 0 1.56 1.03H21v3h-.08A1.7 1.7 0 0 0 19.4 15Z'],
  palette: ['M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0 0-12h-2Z','M7.5 10h.01','M9.5 6.5h.01','M14.5 6.5h.01','M16.5 10h.01'],
  gift: ['M20 12v8H4v-8','M2 7h20v5H2z','M12 7v13','M12 7H7.5a2.5 2.5 0 1 1 2.3-3.5C11 5 12 7 12 7Zm0 0h4.5a2.5 2.5 0 1 0-2.3-3.5C13 5 12 7 12 7Z'],
  star: ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z'],
  trash: ['M4 7h16','M9 7V4h6v3','m6 7 1 13h10l1-13','M10 11v5','M14 11v5'], shuffle: ['M4 7h3c4 0 5 10 10 10h3','m17 14 3 3-3 3','M4 17h3c1.5 0 2.5-1 3.4-2.3','M14 9.3C15 8 16 7 17 7h3','m17 4 3 3-3 3'], sort: ['M8 6h8','M8 12h6','M8 18h4','m4 14-3 3-3-3','M4 5v12'], play: ['m8 5 11 7-11 7Z']
}
</script>
<template><svg :width="size || 20" :height="size || 20" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="strokeWidth || 2" stroke-linecap="round" stroke-linejoin="round"><path v-for="d in paths[name] || []" :key="d" :d="d" /></svg></template>
