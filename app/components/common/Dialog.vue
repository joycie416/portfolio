<template>
  <Dialog :open="open">
    <DialogContent :class="props.class">
      <DialogHeader>
        <DialogTitle class="text-center font-semibold text-xl">
          {{ title }}
        </DialogTitle>
      </DialogHeader>
      <slot />
      <DialogFooter v-if="$slots.footer" class="*:w-full">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  title: string;
  open: boolean;
  class?: HTMLAttributes["class"];
}>();
</script>
