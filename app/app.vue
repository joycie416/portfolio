<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster
      position="top-center"
      :toast-options="{
        classes: {
          success:
            'bg-primary-50! border-primary-500! text-primary-700! px-4! py-3! shadow-none!',
          error:
            'bg-red-01! border-red-04! text-red-05! px-4! py-3! shadow-none!',
          info: 'bg-gray-01! border-gray-03! text-text-gray-01! px-4! py-3! shadow-none!',
        },
      }"
    />
    <LoadingOverlay :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { LoadingOverlay } from "@/components/common";

const { loading } = useLoading();
</script>

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
