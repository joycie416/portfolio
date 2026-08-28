<template>
  <Select
    v-model="selectModel"
    :disabled="props.disabled"
    :required="props.required"
  >
    <SelectTrigger :class="cn('h-9 md:h-10 w-full', props.class)">
      <SelectValue :placeholder="props.placeholder" />
    </SelectTrigger>
    <SelectContent class="max-h-45">
      <template v-for="option in props.options" :key="String(option.value)">
        <SelectItem
          v-if="!option.children || option.children.length === 0"
          :value="String(option.value)"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </SelectItem>
        <SelectGroup v-else>
          <SelectLabel>{{ option.label }}</SelectLabel>
          <SelectItem
            v-for="child in option.children"
            :key="String(child.value)"
            :value="String(child.value)"
            :disabled="child.disabled"
            class="pl-5"
          >
            {{ child.label }}
          </SelectItem>
        </SelectGroup>
      </template>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts" generic="TValue extends string | number">
import type { DropdownProps } from "@/types/input-group";
import type { InputOption } from "@/types/common";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const props = defineProps<DropdownProps<TValue>>();

const model = defineModel<TValue | undefined>();

const findOption = (
  options: InputOption<TValue>[],
  value: string
): InputOption<TValue> | undefined => {
  for (const option of options) {
    if (String(option.value) === value) return option;

    const child = option.children
      ? findOption(option.children, value)
      : undefined;
    if (child) return child;
  }

  return undefined;
};

const selectModel = computed({
  get: () => (model.value === undefined ? undefined : String(model.value)),
  set: (value: string | undefined) => {
    if (value === undefined) {
      model.value = undefined;
      return;
    }

    model.value = findOption(props.options, value)?.value;
  },
});
</script>
