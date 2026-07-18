<script setup lang="ts">
import Icon from './UiIcon.vue'
defineProps<{ modelValue: 'classic' | 'register' }>()
defineEmits<{ 'update:modelValue': [value: 'classic' | 'register'] }>()
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <button v-for="item in ([
      { id: 'classic', title: 'Ruleta Clásica', text: 'Los participantes (o tú), giran la ruleta anónimamente.' },
      { id: 'register', title: 'Ruleta con Registro', text: 'Los participantes se registran, dejan sus datos, y luego giran la ruleta' }
    ] as const)" :key="item.id" type="button"
      class="flex min-h-[83px] items-center justify-between rounded-lg border px-5 text-left transition"
      :class="modelValue === item.id ? 'border-[#e10b86] bg-[#fff7fa]' : 'border-[#b9bbc0] bg-white text-[#555b68]'"
      @click="$emit('update:modelValue', item.id)">
      <span><span class="flex items-center gap-2 text-[20px] font-bold text-[#0b1221]">{{ item.title }} <small v-if="item.id === 'register'" class="rounded bg-[#e5f5ee] px-2 py-1 text-[10px] font-bold text-[#438a72]">NUEVO</small></span><span class="mt-1 block text-[15px]">{{ item.text }}</span></span>
      <span class="grid size-6 shrink-0 place-items-center rounded-full text-white" :class="modelValue === item.id ? 'bg-[#d91886]' : 'bg-[#59606b]'">
        <Icon name="check" :size="15" :stroke-width="3" />
      </span>
    </button>
  </div>
</template>
