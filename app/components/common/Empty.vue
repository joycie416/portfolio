<template>
  <div
    class="flex flex-col items-center justify-center gap-2 text-text-gray-04"
  >
    <FileXCorner class="size-6 md:size-8" />
    <p v-if="props.message" class="text-sm">{{ props.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { FileXCorner } from "@lucide/vue";

interface Props {
  message?: string;
}

const props = defineProps<Props>();
</script>
