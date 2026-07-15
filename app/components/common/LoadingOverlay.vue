<template>
  <div
    v-if="loading"
    class="loading-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <LoaderCircle class="size-10 text-white animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle } from "@lucide/vue";

defineProps<{
  loading: boolean;
}>();
</script>

<style>
/* 오버레이가 DOM에 있을 때(v-if로 렌더링된 동안) 배경 스크롤을 막는다. */
html:has(.loading-overlay) {
  overflow: hidden;
}
</style>
