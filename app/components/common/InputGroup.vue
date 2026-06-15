<template>
  <div :class="props.containerClass">
    <label
      v-if="props.label"
      :class="
        cn(
          'font-medium block mb-1 text-sm md:text-base',
          props.required && 'required-label',
          stateStyle,
        )
      "
    >
      {{ props.label }}
    </label>
    <!-- 텍스트 -->
    <Input
      v-if="props.type === 'text'"
      v-model="singleModel"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :class="cn(props.class, stateStyle)"
    />
    <!-- 드롭다운 -->
    <Dropdown
      v-if="props.type === 'dropdown'"
      v-model="singleModel"
      :options="props.options"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :class="cn(props.class, stateStyle)"
    />
    <!-- 체크박스 -->
    <div
      v-if="props.type === 'checkbox'"
      id="checkbox-container"
      class="h-8 md:h-10 flex items-center gap-4"
    >
      <div
        v-for="option in props.options"
        :key="option.value"
        class="flex items-center gap-2"
      >
        <input
          :id="getCheckboxId(option.value)"
          v-model="checkedValues"
          type="checkbox"
          :value="option.value"
          :disabled="props.disabled || option.disabled"
          class="size-3.5 md:size-4 shrink-0 rounded-sm cursor-pointer"
        />
        <label
          :for="getCheckboxId(option.value)"
          :class="
            cn(
              'text-sm md:text-base',
              !option.disabled && 'cursor-pointer',
              stateStyle,
            )
          "
        >
          {{ option.label }}
        </label>
      </div>
    </div>
    <!-- 비밀번호 -->
    <div v-if="props.type === 'password'" class="relative">
      <Input
        :type="showPassword ? 'text' : 'password'"
        v-model="singleModel"
        :placeholder="props.placeholder"
        :required="props.required"
        :disabled="props.disabled"
        :class="cn(props.class, stateStyle)"
      />
      <Button
        v-if="props.enableToggle"
        variant="ghost"
        size="icon"
        class="size-7 md:size-8 text-text-gray-03 absolute right-0.5 md:right-1 top-1/2 -translate-y-1/2"
        @click="togglePassword"
      >
        <EyeOffIcon v-if="showPassword" class="size-5" />
        <EyeIcon v-if="!showPassword" class="size-5" />
      </Button>
    </div>
    <p
      v-if="props.hint"
      :class="cn('text-xs text-text-gray-04 mt-2', stateStyle)"
    >
      {{ props.hint }}
    </p>
  </div>
</template>

<script setup lang="ts" generic="TValue extends string | number">
import type { InputGroupProps } from "@/types/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "@lucide/vue";
import Dropdown from "./Dropdown.vue";

const props = withDefaults(defineProps<InputGroupProps<TValue>>(), {
  type: "text",
  state: "success",
  enableToggle: true,
});

const model = defineModel<TValue | TValue[] | undefined>();

const singleModel = computed({
  get: () => (Array.isArray(model.value) ? undefined : model.value),
  set: (value: TValue | undefined) => {
    model.value = value;
  },
});

const checkedValues = computed({
  get: () => (Array.isArray(model.value) ? model.value : []) as TValue[],
  set: (value: TValue[]) => {
    model.value = value;
  },
});

const showPassword = ref<boolean>(false);

function getCheckboxId(value: TValue) {
  return `checkbox-${String(value)}`;
}

function togglePassword() {
  if (props.type !== "password" || !props?.enableToggle) return;

  showPassword.value = !showPassword.value;
}

const stateStyle = computed(() => {
  switch (props.state) {
    case "success":
      return "selection:text-text-gray-01";
    case "error":
      return "text-red-04 border-red-04 focus-visible:border-red-04 focus-visible:ring-red-02 selection:text-red-04";
  }
});
</script>

<style lang="scss" scoped>
.required-label::after {
  content: " *";
  color: var(--color-red-04);
}
</style>
