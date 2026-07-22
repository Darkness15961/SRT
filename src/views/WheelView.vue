<script setup lang="ts">
import ModeSelector from '@/components/ModeSelector.vue'
import WheelSidebar from '@/components/WheelSidebar.vue'
import WheelStage from '@/components/WheelStage.vue'
import { useWheelStore } from '@/composables/useWheelStore'

const store = useWheelStore()
</script>

<template>
  <section class="mx-auto max-w-[1380px] px-4 pb-12 pt-8 sm:max-w-[738px] sm:px-6 lg:max-w-[1390px] lg:px-16 lg:pt-[63px]">
    <div class="mb-7 text-center lg:mb-[42px] lg:ml-[400px] lg:text-left">
      <h1 class="text-[24px] font-black tracking-[-.8px] text-[#07142d] lg:text-[40px] lg:tracking-[-1.4px]">La Ruleta Aleatoria</h1>
      <p class="mt-2 text-[17px] text-[#606575] lg:mt-1">¡Gira la ruleta y obtén tus ganadores al azar!</p>
    </div>

    <div class="hidden lg:block"><ModeSelector v-model="store.state.mode" /></div>

    <div class="mt-4 grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <WheelSidebar :store="store" />
      <WheelStage :store="store" />
    </div>
  </section>
</template>
