<template>
  <Dialog :title="title" :open="open" class="md:w-100">
    <p class="text-center text-sm text-text-gray-03">
      <slot>{{ description }}</slot>
    </p>
    <template #footer>
      <Button variant="outline" :disabled="loading" @click="emit('cancel')">
        {{ cancelText }}
      </Button>
      <Button
        :variant="confirmVariant"
        :disabled="loading"
        @click="emit('confirm')"
      >
        {{ confirmText }}
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from "@/components/common";
import { Button, type ButtonVariants } from "@/components/ui/button";

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    /** 본문 텍스트. 커스텀 내용이 필요하면 기본 슬롯을 사용한다. */
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    confirmVariant?: ButtonVariants["variant"];
  }>(),
  {
    description: "",
    confirmText: "확인",
    cancelText: "취소",
    loading: false,
    confirmVariant: "default",
  }
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
