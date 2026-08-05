<template>
  <div
    :class="
      cn(
        'relative p-5 bg-white shadow-sm overflow-hidden max-md:-mx-5 max-md:-mt-5 md:p-7 md:rounded-3xl',
        props.class
      )
    "
  >
    <template v-if="props.imgSrc">
      <NuxtImg :src="props.imgSrc" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-gray-00/50" />
    </template>
    <div v-else class="absolute inset-0 bg-gray-02" />
    <div :class="cn('size-full relative', props.contentClass)">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

interface Props {
  imgSrc?: string;
  class?: HTMLAttributes["class"];
  contentClass?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>
