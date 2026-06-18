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
      <SelectItem
        v-for="option in props.options"
        :key="String(option.value)"
        :value="String(option.value)"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts" generic="TValue extends string | number">
import type { DropdownProps } from "@/types/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const props = defineProps<DropdownProps<TValue>>();

const model = defineModel<TValue | undefined>();

const selectModel = computed({
  get: () => (model.value === undefined ? undefined : String(model.value)),
  set: (value: string | undefined) => {
    if (value === undefined) {
      model.value = undefined;
      return;
    }

    const selected = props.options.find(
      (option) => String(option.value) === value
    );

    model.value = selected?.value;
  },
});
</script>
