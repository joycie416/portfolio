<template>
  <div class="input-file-preview" :data-state="props.state">
    <label
      v-if="props.label"
      :class="
        props.required
          ? 'input-file-preview__label required-label'
          : 'input-file-preview__label'
      "
    >
      {{ props.label }}
    </label>

    <div
      class="input-file-preview__frame"
      :class="{
        'input-file-preview__frame--empty': !previewUrl,
        'input-file-preview__frame--disabled': props.disabled,
      }"
      role="button"
      tabindex="0"
      :aria-label="previewUrl ? '이미지 변경' : '이미지 선택'"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="이미지 미리보기"
        class="input-file-preview__image"
      />
      <div v-else class="input-file-preview__placeholder">
        <ImagePlus class="input-file-preview__icon" />
        <p class="input-file-preview__hint">이미지를 선택해주세요</p>
        <p class="input-file-preview__subhint">최대 10MB</p>
      </div>

      <button
        v-if="previewUrl && !props.disabled"
        type="button"
        class="input-file-preview__remove"
        aria-label="이미지 삭제"
        @click.stop="clear"
      >
        <X class="size-4" />
      </button>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      class="hidden"
      :disabled="props.disabled"
      @change="onInputChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ImagePlus, X } from "@lucide/vue";
import { toast } from "vue-sonner";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

const props = withDefaults(
  defineProps<{
    /** 기존 이미지 URL (수정 시 미리보기용) */
    url?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    state: "success" | "error";
  }>(),
  {
    url: undefined,
    label: undefined,
    required: false,
    disabled: false,
    state: "success",
  }
);

const model = defineModel<File | null>({ default: null });

const emit = defineEmits<{
  remove: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const objectUrl = ref<string | null>(null);

const previewUrl = computed(() => objectUrl.value || props.url || "");

const revokeObjectUrl = () => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
};

const setPreviewFromFile = (file: File) => {
  revokeObjectUrl();
  objectUrl.value = URL.createObjectURL(file);
};

const validateFile = (file: File): boolean => {
  if (!file.type.startsWith("image/")) {
    toast.error("이미지 파일만 업로드할 수 있습니다.");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("이미지는 최대 10MB까지 업로드 가능합니다.");
    return false;
  }

  return true;
};

const applyFile = (file: File | undefined) => {
  if (!file) return;

  if (!validateFile(file)) {
    if (inputRef.value) inputRef.value.value = "";
    return;
  }

  model.value = file;
};

const openPicker = () => {
  if (props.disabled) return;
  inputRef.value?.click();
};

const onInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  applyFile(input.files?.[0]);
};

const clear = () => {
  model.value = null;
  revokeObjectUrl();
  if (inputRef.value) inputRef.value.value = "";
  emit("remove");
};

watch(
  model,
  (file) => {
    if (file) {
      setPreviewFromFile(file);
      return;
    }
    revokeObjectUrl();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  revokeObjectUrl();
});
</script>

<style lang="scss" scoped>
.input-file-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    display: block;
    font-size: 14px;
    line-height: calc(1.125 / 0.875) rem;
    font-weight: 500;

    @include md {
      font-size: 1rem;
      line-height: 1.5rem;
    }

    .input-file-preview[data-state="error"] & {
      color: var(--color-red-04);
    }

    &.required-label::after {
      content: " *";
      color: var(--color-red-04);
    }
  }

  &__frame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid var(--color-gray-03);
    border-radius: 8px;
    background-color: var(--color-gray-01);
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s ease;

    &:hover:not(&--disabled),
    &:focus-visible:not(&--disabled) {
      border-color: var(--color-gray-04);
    }

    .input-file-preview[data-state="error"] & {
      border-color: var(--color-destructive);
    }

    &--empty {
      border-style: dashed;
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px;
    color: var(--color-gray-04);
  }

  &__icon {
    width: 28px;
    height: 28px;

    @include md {
      width: 32px;
      height: 32px;
    }
  }

  &__hint {
    font-size: 0.8rem;
    color: var(--color-gray-05);

    @include md {
      font-size: 0.875rem;
    }
  }

  &__subhint {
    font-size: 0.7rem;
    color: var(--color-gray-04);

    @include md {
      font-size: 0.75rem;
    }
  }

  &__remove {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--color-gray-09) 55%, transparent);
    color: white;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--color-gray-09) 75%,
        transparent
      );
    }
  }
}
</style>
