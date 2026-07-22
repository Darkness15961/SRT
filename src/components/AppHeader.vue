<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from './UiIcon.vue'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)

const goToConfig = () => {
  router.push('/config')
  menuOpen.value = false
}

const goToHome = () => {
  router.push('/')
  menuOpen.value = false
}
</script>

<template>
  <header class="relative z-50 h-[74px] border-t-2 border-[#252831] border-b border-[#e8e8ea] bg-white lg:h-20">
    <div class="mx-auto flex h-full max-w-[1380px] items-center justify-between px-5 sm:max-w-[738px] sm:px-6 lg:max-w-[1390px] lg:px-16">
      <div class="flex items-center gap-5"><img src="/img/logo.png" alt="AppSorteos" class="h-10 w-auto object-contain" /><a class="hidden items-center gap-2 text-[13px] font-semibold sm:flex lg:hidden" href="#"><i class="fa-solid fa-grip"></i> Aplicaciones</a></div>
      <nav class="hidden items-center gap-8 text-[15px] font-semibold text-black lg:flex">
        <button class="flex items-center gap-2" @click="goToHome">
          <i class="fa-solid fa-rotate-right"></i> Ruleta
        </button>
        <button class="flex items-center gap-2" @click="goToConfig">
          <i class="fa-solid fa-gear"></i> Configuración
        </button>
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
        <button class="mobile-link text-left" @click="goToHome">Ruleta</button>
        <button class="mobile-link text-left" @click="goToConfig">Configuración</button>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.hamb {
  display: flex;
  width: 29px;
  flex-direction: column;
  gap: 6px;
}
.hamb i {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: #777;
}
</style>

<style>
.mobile-link {
  display: flex;
  height: 64px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #ddd;
  padding: 0 16px;
  font-size: 18px;
  color: #000;
}
.drawer-enter-active,
.drawer-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: 0.25s;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
