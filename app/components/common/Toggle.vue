<template>
  <div
    class="toggle"
    data-slot="toggle"
    :data-disabled="disabled"
    :data-state="state"
    :class="class"
    :data-toggle="model ? 'on' : 'off'"
  >
    <label
      v-if="label || $slots.default"
      :for="toggleId"
      data-slot="toggle-label"
      class="toggle__label"
      :class="classes?.label"
    >
      <slot />
      <span v-if="label">{{ label }}</span>
    </label>
    <div
      class="toggle__track"
      :class="classes?.track"
      data-slot="toggle-track"
      @click="handleClick"
    >
      <button
        type="button"
        role="switch"
        :aria-checked="model"
        :disabled="disabled"
        class="toggle__thumb"
        :class="classes?.thumb"
        data-slot="toggle-thumb"
        @click.stop="handleClick"
      />
      <input
        type="checkbox"
        :id="toggleId"
        v-model="model"
        :disabled="disabled"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { InputGroupState } from "@/types/input-group";

const props = withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
    state?: InputGroupState;
    class?: HTMLAttributes["class"];
    classes?: {
      label?: HTMLAttributes["class"];
      track?: HTMLAttributes["class"];
      thumb?: HTMLAttributes["class"];
    };
  }>(),
  {
    state: "success",
    disabled: false,
  }
);
const toggleId = useId();

const model = defineModel<boolean>({ default: false });

const handleClick = () => {
  if (props.disabled) return;
  model.value = !model.value;
};
</script>

<style lang="scss" scoped>
// prop으로 넘겨준 클래스를 적용할 수 있도록 @layer components 사용
@layer components {
  .toggle {
    display: flex;
    align-items: center;
    gap: 8px;

    &__label {
      font-size: 14px;

      .toggle[data-state="error"] & {
        color: var(--color-red-04);
      }
    }
    &__track {
      width: 40px;
      height: 20px;
      border-radius: 999px;
      background-color: var(--color-gray-02);
      position: relative;

      transition: background-color 0.1s ease-in-out;
      cursor: pointer;

      .toggle[data-toggle="on"] & {
        background-color: var(--color-primary-200);
      }

      .toggle[data-state="error"] & {
        background-color: var(--color-red-03);
      }

      .toggle[data-disabled="true"] & {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
    &__thumb {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background-color: white;
      position: absolute;
      top: 2px;
      left: 2px;

      transition: left 0.1s ease-in-out;
      cursor: pointer;

      .toggle[data-toggle="on"] & {
        left: 22px;
      }

      .toggle[data-state="error"][data-toggle="off"] & {
        background-color: var(--color-gray-01);
      }

      .toggle[data-disabled="true"] & {
        cursor: not-allowed;
        opacity: 0.7;
        pointer-events: none;
      }
    }
  }
}
</style>
