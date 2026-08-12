<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center gap-2 text-text-gray-04',
        props.class
      )
    "
  >
    <MessageSquareText class="size-6 md:size-8" />
    <p class="text-sm">첫 댓글을 남겨주세요!</p>
  </div>
</template>

<script setup lang="ts">
import { MessageSquareText } from "@lucide/vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
