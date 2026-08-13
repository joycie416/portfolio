<template>
  <div class="file-item">
    <span class="file-item__icon">
      <File class="size-full" />
      <span
        class="file-item__ext"
        :style="{
          backgroundColor: fileType.color,
          color: badgeTextColor,
          letterSpacing: badgeLetterSpacing,
        }"
      >
        {{ fileType.type.toUpperCase() }}
      </span>
    </span>

    <div class="file-item__info">
      <component
        :is="href ? 'a' : 'p'"
        class="file-item__name"
        :href="downloadHref"
        :download="href ? props.file.name : undefined"
        :title="props.file.name"
      >
        <span class="file-item__name-base">{{ displayName.base }}</span>
        <span v-if="displayName.ext" class="file-item__name-ext">
          {{ displayName.ext }}
        </span>
      </component>
      <span class="file-item__size">{{ formattedSize }}</span>
    </div>

    <a
      v-if="href"
      class="file-item__action"
      :href="downloadHref"
      :download="props.file.name"
      aria-label="다운로드"
    >
      <Download />
    </a>
    <button
      v-if="removable"
      type="button"
      class="file-item__action"
      aria-label="첨부파일 삭제"
      @click="emit('remove')"
    >
      <X />
    </button>
  </div>
</template>

<script setup lang="ts">
import { File, X, Download } from "@lucide/vue";
import { formatFileSize, getFileType } from "@/utils/format-file";

const props = withDefaults(
  defineProps<{
    /** 새 파일(File) 또는 기존 스토리지 파일의 name/size */
    file: Pick<File, "name" | "size">;
    /** 업로드 완료 후 다운로드 URL. 있으면 다운로드 링크를 노출 */
    href?: string;
    /** 삭제(x) 버튼 노출 여부 */
    removable?: boolean;
  }>(),
  {
    href: undefined,
    removable: true,
  }
);

const emit = defineEmits<{
  remove: [];
}>();

const formattedSize = computed(() => formatFileSize(props.file.size));

// a[download]는 same-origin에서만 동작. Storage URL은 ?download= 로 강제 다운로드.
const downloadHref = computed(() => {
  if (!props.href) return undefined;
  try {
    const url = new URL(props.href);
    if (url.pathname.includes("/storage/v1/object/")) {
      url.searchParams.set("download", props.file.name);
    }
    return url.href;
  } catch {
    return props.href;
  }
});

// 파일명이 길 때 확장자는 유지하고 앞부분만 ...으로 줄이기 위해 분리
const displayName = computed(() => {
  const name = props.file.name;
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) return { base: name, ext: "" };
  return { base: name.slice(0, dotIndex), ext: name.slice(dotIndex) };
});

const fileType = computed(() => getFileType(props.file.name));

// etc는 밝은 배경(--color-gray-01)이라 글자를 어둡게, 나머지는 흰색
const badgeTextColor = computed(() =>
  fileType.value.type === "etc" ? "var(--color-gray-05)" : "white"
);

// 확장자가 4자 이상이면 배지 안에 맞게 폰트 크기를 줄인다
const badgeLetterSpacing = computed(() =>
  fileType.value.type.length >= 4 ? "-0.12em" : undefined
);
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid var(--color-gray-03);
  border-radius: 8px;
  background-color: var(--color-gray-01);

  @include md {
    gap: 10px;
    padding: 8px 12px;
  }

  &__icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--color-gray-05);
  }

  &__ext {
    position: absolute;
    bottom: 0px;
    left: 50%;
    translate: -50% 0;
    padding: 0 3px;
    border-radius: 3px;
    font-size: 0.55rem;
    font-weight: 600;
    line-height: 1.4;
    max-width: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  &__name {
    display: flex;
    min-width: 0;
    font-size: 0.8rem;
    color: var(--color-gray-06, inherit);
    text-decoration: none;

    &:is(a):hover {
      color: var(--color-primary-600);
      text-decoration: underline;
    }

    @include md {
      font-size: 0.9rem;
    }
  }

  &__name-base {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  &__name-ext {
    flex-shrink: 0;
    white-space: nowrap;
  }

  &__size {
    font-size: 0.6rem;
    color: var(--color-gray-04);

    @include md {
      font-size: 0.75rem;
    }
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    padding: 2px;
    border-radius: 6px;
    color: var(--color-gray-05);
    cursor: pointer;

    &:hover {
      background-color: var(--color-gray-02);
      color: var(--color-gray-06, inherit);
    }

    @include md {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
