<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-center" />
  </div>
</template>

<style>
.app {
  min-width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: var(--color-primary-45);
  color: var(--color-text-gray-01);
}
</style>
