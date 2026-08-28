<template>
  <div
    class="toggle"
    data-slot="toggle"
    :data-disabled="disabled"
    :data-state="state"
    :class="props.class"
    :data-toggle="model ? 'on' : 'off'"
    :data-size="size"
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
        :id="toggleId"
        v-model="model"
        type="checkbox"
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
    size?: "sm" | "default";
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
    size: "default",
    classes: () => ({}),
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

    &[data-size="default"] {
      @include toggle-sizes(16px, 40px, 20px);
    }
    &[data-size="sm"] {
      @include toggle-sizes(12px, 30px, 16px);
    }

    &__label {
      font-size: 14px;

      .toggle[data-state="error"] & {
        color: var(--color-red-04);
      }
    }
    &__track {
      width: var(--toggle-track-width);
      height: var(--toggle-track-height);
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
      width: var(--toggle-thumb-size);
      height: var(--toggle-thumb-size);
      border-radius: 999px;
      background-color: white;
      position: absolute;
      top: var(--toggle-thumb-gap);
      left: var(--toggle-thumb-gap);

      transition: left 0.1s ease-in-out;
      cursor: pointer;

      .toggle[data-toggle="on"] & {
        left: calc(
          var(--toggle-track-width) - var(--toggle-thumb-size) - var(
              --toggle-thumb-gap
            )
        );
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
