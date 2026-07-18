<script setup lang="ts">
import { ref } from 'vue'
import Icon from './UiIcon.vue'
const menuOpen = ref(false)
</script>

<template>
  <header class="relative z-50 h-[74px] border-t-2 border-[#252831] border-b border-[#e8e8ea] bg-white lg:h-20">
    <div class="mx-auto flex h-full max-w-[1380px] items-center justify-between px-5 sm:max-w-[738px] sm:px-6 lg:max-w-[1390px] lg:px-16">
      <div class="flex items-center gap-5"><img src="/img/logo.png" alt="AppSorteos" class="h-10 w-auto object-contain" /><a class="hidden items-center gap-2 text-[13px] font-semibold sm:flex lg:hidden" href="#"><i class="fa-solid fa-grip"></i> Aplicaciones</a></div>
      <nav class="hidden items-center gap-8 text-[15px] font-semibold text-black lg:flex">
        <a class="flex items-center gap-2" href="#"><i class="fa-solid fa-grip"></i> Aplicaciones <Icon name="chevron-down" :size="14" /></a>
        <a href="#">DM Automation</a><span class="-ml-6 rounded bg-[#e8f1ff] px-2 py-1 text-[10px] font-medium text-[#2660b5]">Nuevo</span>
        <a href="#">Precios</a>
        <a class="flex items-center gap-2" href="#">Ayuda <Icon name="chevron-down" :size="14" /></a>
      </nav>
      <div class="hidden items-center gap-6 text-[15px] font-semibold lg:flex">
        <button class="hidden sm:block">Ingresar</button>
        <button class="rounded-lg bg-[#d81383] px-5 py-3 font-bold text-white">Crear cuenta</button>
        <button class="hidden items-center gap-2 sm:flex">ES <Icon name="chevron-down" :size="14" /></button>
      </div>
      <button class="grid size-[50px] place-items-center rounded border-2 border-[#222] lg:hidden" aria-label="Abrir menú" @click="menuOpen=true"><span class="hamb"><i></i><i></i><i></i></span></button>
    </div>
  </header>
  <Teleport to="body">
    <transition name="fade"><button v-if="menuOpen" class="fixed inset-0 z-[80] bg-[#263047]/35" aria-label="Cerrar menú" @click="menuOpen=false"></button></transition>
    <transition name="drawer">
      <aside v-if="menuOpen" class="fixed bottom-0 left-0 top-0 z-[90] w-[340px] max-w-[82vw] bg-white pt-20 shadow-2xl">
        <a class="mobile-link" href="#">DM Automation <span class="rounded bg-[#e8f1ff] px-2 py-1 text-[10px] text-[#2660b5]">Nuevo</span></a>
        <a class="mobile-link" href="#">Precios</a>
        <a class="mobile-link" href="#">Ayuda <Icon name="chevron-down" :size="16" /></a>
        <a class="mobile-link" href="#">Ingresar</a>
        <div class="border-b px-4 py-3"><button class="rounded-lg bg-[#d81383] px-4 py-2.5 text-[14px] font-bold text-white">Crear cuenta</button></div>
        <a class="mobile-link" href="#">ES <Icon name="chevron-down" :size="16" /></a>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.hamb{display:flex;width:29px;flex-direction:column;gap:6px}.hamb i{display:block;height:2px;border-radius:2px;background:#777}.mobile-link{display:flex;height:64px;align-items:center;gap:10px;border-bottom:1px solid #ddd;padding:0 16px;font-size:18px;color:#000}.drawer-enter-active,.drawer-leave-active,.fade-enter-active,.fade-leave-active{transition:.25s}.drawer-enter-from,.drawer-leave-to{transform:translateX(-100%)}.fade-enter-from,.fade-leave-to{opacity:0}
</style>
