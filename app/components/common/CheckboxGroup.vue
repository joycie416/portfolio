<template>
  <div
    :class="
      cn(
        'flex gap-x-4 gap-y-2',
        props.direction === 'vertical'
          ? 'flex-col'
          : 'flex-wrap items-center',
        props.class
      )
    "
  >
    <Checkbox
      v-for="option in props.options"
      :key="option.value"
      :model-value="isChecked(option.value)"
      :label="option.label"
      :disabled="props.disabled || option.disabled"
      :state="props.state"
      @update:model-value="(checked) => toggle(option.value, checked)"
    />
  </div>
</template>

<script setup lang="ts" generic="TValue extends string | number">
import type { CheckboxGroupProps } from "@/types/input-group";
import { cn } from "@/lib/utils";
import Checkbox from "./Checkbox.vue";

const props = withDefaults(defineProps<CheckboxGroupProps<TValue>>(), {
  state: "success",
  direction: "horizontal",
});

const model = defineModel<TValue[]>({ default: () => [] });

function isChecked(value: TValue) {
  return model.value.includes(value);
}

function toggle(value: TValue, checked: boolean) {
  model.value = checked
    ? [...model.value, value]
    : model.value.filter((v) => v !== value);
}
</script>
