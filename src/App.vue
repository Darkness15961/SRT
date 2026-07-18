<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="min-h-[calc(100vh-80px)] bg-white">
    <RouterView />
  </main>
</template>
