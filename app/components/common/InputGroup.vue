<template>
  <div>
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
    <Input
      v-if="props.type === 'text'"
      v-model="model"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :class="cn(props.class, stateStyle)"
    />
    <!-- TODO: Dropdown 컴포넌트 추가 -->
    <Input
      v-if="props.type === 'dropdown'"
      v-model="model"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :class="cn(props.class, stateStyle)"
    />
    <!-- TODO: Checkbox 컴포넌트 추가 -->
    <Input
      v-if="props.type === 'checkbox'"
      v-model="model"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :class="cn(props.class, stateStyle)"
    />
    <div v-if="props.type === 'password'" class="relative">
      <Input
        :type="showPassword ? 'text' : 'password'"
        v-model="model"
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
import type { HTMLAttributes } from "vue";
import type { InputOption } from "@/types/common";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "@lucide/vue";

interface CommonProps {
  state?: "success" | "error";
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  class?: HTMLAttributes["class"];
}

type Props =
  | (CommonProps & { type: "text" })
  | (CommonProps & { type: "password"; enableToggle?: boolean })
  | (CommonProps & {
      type: "dropdown" | "checkbox";
      options: InputOption<TValue>[];
    });

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  state: "success",
  enableToggle: true,
});

const model = defineModel<TValue | undefined>();

const showPassword = ref<boolean>(false);

const togglePassword = () => {
  if (props.type !== "password" || !props?.enableToggle) return;

  showPassword.value = !showPassword.value;
};

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
