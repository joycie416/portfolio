<template>
  <label
    :class="
      cn(
        'inline-flex items-center gap-2',
        !props.disabled && 'cursor-pointer',
        props.class
      )
    "
  >
    <input
      ref="inputRef"
      type="checkbox"
      :checked="model"
      :disabled="props.disabled"
      class="size-3.5 md:size-4 shrink-0 rounded-sm cursor-pointer disabled:cursor-not-allowed"
      @change="model = ($event.target as HTMLInputElement).checked"
    />
    <span
      v-if="props.label || $slots.default"
      :class="cn('text-sm md:text-base', stateStyle)"
    >
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { InputGroupState } from "@/types/input-group";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    state?: InputGroupState;
    class?: HTMLAttributes["class"];
  }>(),
  {
    state: "success",
  }
);

const model = defineModel<boolean>({ default: false });

const inputRef = ref<HTMLInputElement | null>(null);

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate ?? false;
  }
});

const stateStyle = computed(() =>
  props.state === "error" ? "text-red-04" : ""
);
</script>
