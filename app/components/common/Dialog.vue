<template>
  <Dialog :open="open">
    <DialogContent>
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
const props = withDefaults(
  defineProps<{
    title: string;
    open: boolean;
  }>(),
  {
    title: "",
    open: false,
  }
);
</script>
