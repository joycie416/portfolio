<template>
  <div
    :class="
      cn(
        'p-5 bg-white border border-gray-02 rounded-[20px] md:p-7 md:rounded-3xl',
        props.title && 'pt-4 md:pt-6',
        props.class,
      )
    "
  >
    <p
      v-if="props.title"
      data-slot="card-title"
      class="text-lg font-bold mb-1 md:text-2xl md:mb-3"
      aria-label="card title"
    >
      {{ props.title }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  title?: string;
  class?: HTMLAttributes["class"];
}>();
</script>
