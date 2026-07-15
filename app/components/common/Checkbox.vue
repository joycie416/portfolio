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
    <span class="relative inline-flex size-3.5 md:size-4 shrink-0">
      <input
        type="checkbox"
        :checked="model"
        :disabled="props.disabled"
        class="peer size-full appearance-none rounded-[2px] border border-border bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary-600 checked:bg-primary-600"
        @change="model = ($event.target as HTMLInputElement).checked"
      />
      <Check
        v-if="model"
        class="pointer-events-none absolute inset-0 m-auto size-3/4 text-white"
        :stroke-width="3"
      />
    </span>
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
import { Check } from "@lucide/vue";
import type { InputGroupState } from "@/types/input-group";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
    state?: InputGroupState;
    class?: HTMLAttributes["class"];
  }>(),
  {
    state: "success",
  }
);

const model = defineModel<boolean>({ default: false });

const stateStyle = computed(() =>
  props.state === "error" ? "text-red-04" : ""
);
</script>
