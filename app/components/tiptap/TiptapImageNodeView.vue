<template>
  <node-view-wrapper
    class="tiptap-image"
    :class="{ 'tiptap-image--selected': selected }"
  >
    <img
      ref="imgRef"
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :width="node.attrs.width"
      :height="node.attrs.height"
      :data-inline-key="node.attrs['data-inline-key']"
      :style="imageStyle"
      draggable="false"
      class="tiptap-image__img"
    />
    <div
      v-if="inlineKey"
      class="tiptap-image__thumbnail"
      @mousedown.stop.prevent
      @click.stop
    >
      <Toggle
        :model-value="isThumbnail"
        label="대표"
        size="sm"
        @update:model-value="handleToggle"
      />
    </div>
    <template v-if="selected && resizeConfig && editor.isEditable">
      <div
        v-for="direction in resizeConfig.directions"
        :key="direction"
        class="tiptap-image__handle"
        :class="`tiptap-image__handle--${direction}`"
        @mousedown.stop.prevent="onHandleMouseDown(direction, $event)"
      />
    </template>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { Toggle } from "@/components/common";

type ResizeDirection = "top" | "bottom" | "left" | "right";

type ResizeOption = {
  enabled: boolean;
  directions?: ResizeDirection[];
  minWidth?: number;
  minHeight?: number;
  alwaysPreserveAspectRatio?: boolean;
};

const props = defineProps(nodeViewProps);

const inlineKey = computed(
  () => (props.node.attrs["data-inline-key"] as string | null) ?? null
);
const isThumbnail = computed(() => Boolean(props.node.attrs["data-thumbnail"]));

// InlineImage 확장의 onToggleThumbnail 옵션(TiptapEditor의 setThumbnail)을 호출해
// "게시글당 대표이미지 1개" 규칙을 문서 전체 기준으로 적용한다.
const handleToggle = (value: boolean) => {
  const key = inlineKey.value;
  if (!key) return;

  const { onToggleThumbnail } = props.extension.options as {
    onToggleThumbnail: (key: string | null) => void;
  };
  onToggleThumbnail(value ? key : null);
};

// ------------ 리사이즈 ------------
// tiptap Image가 내장 리사이즈 핸들을 제공하지만,
// addNodeView를 커스텀 Vue 뷰로 덮어쓰면서 그 기능이 사라져 직접 구현
const imgRef = ref<HTMLImageElement | null>(null);

const resizeConfig = computed(() => {
  const resize = (props.extension.options as { resize?: ResizeOption | false })
    .resize;
  if (!resize || !resize.enabled) return null;

  return {
    directions: resize.directions?.length
      ? resize.directions
      : (["bottom", "right"] as ResizeDirection[]),
    minWidth: resize.minWidth ?? 20,
    minHeight: resize.minHeight ?? 20,
    preserveAspectRatio: resize.alwaysPreserveAspectRatio === true,
  };
});

const previewSize = ref<{ width: number; height: number } | null>(null);
const imageStyle = computed(() => {
  const size = previewSize.value;
  if (!size) return undefined;
  return { width: `${size.width}px`, height: `${size.height}px` };
});

let activeDirection: ResizeDirection | null = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let aspectRatio = 1;
let isShiftPressed = false;

// 방향과 마우스 이동량으로 새 width/height를 계산하고, 종횡비 고정/최소 크기 제약을 적용
const calculateSize = (deltaX: number, deltaY: number) => {
  const config = resizeConfig.value;
  if (!activeDirection || !config)
    return { width: startWidth, height: startHeight };

  const isRight = activeDirection === "right";
  const isLeft = activeDirection === "left";
  const isBottom = activeDirection === "bottom";
  const isTop = activeDirection === "top";

  let width = isRight
    ? startWidth + deltaX
    : isLeft
      ? startWidth - deltaX
      : startWidth;
  let height = isBottom
    ? startHeight + deltaY
    : isTop
      ? startHeight - deltaY
      : startHeight;

  const preserveAspectRatio = config.preserveAspectRatio || isShiftPressed;
  if (preserveAspectRatio) {
    if (isLeft || isRight) height = width / aspectRatio;
    else if (isTop || isBottom) width = height * aspectRatio;
  }

  const { minWidth, minHeight } = config;
  if (preserveAspectRatio) {
    if (width < minWidth) {
      width = minWidth;
      height = width / aspectRatio;
    }
    if (height < minHeight) {
      height = minHeight;
      width = height * aspectRatio;
    }
  } else {
    width = Math.max(minWidth, width);
    height = Math.max(minHeight, height);
  }

  return { width: Math.round(width), height: Math.round(height) };
};

const onHandleMouseMove = (event: MouseEvent) => {
  if (!activeDirection) return;
  previewSize.value = calculateSize(
    event.clientX - startX,
    event.clientY - startY
  );
};

const stopResizing = () => {
  activeDirection = null;
  window.removeEventListener("mousemove", onHandleMouseMove);
  window.removeEventListener("mouseup", onHandleMouseUp);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
};

const onHandleMouseUp = () => {
  const size = previewSize.value;
  stopResizing();
  previewSize.value = null;
  if (size) props.updateAttributes({ width: size.width, height: size.height });
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Shift") isShiftPressed = true;
};
const onKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Shift") isShiftPressed = false;
};

const onHandleMouseDown = (direction: ResizeDirection, event: MouseEvent) => {
  if (!imgRef.value) return;

  activeDirection = direction;
  startX = event.clientX;
  startY = event.clientY;
  startWidth = imgRef.value.offsetWidth;
  startHeight = imgRef.value.offsetHeight;
  aspectRatio =
    startWidth > 0 && startHeight > 0 ? startWidth / startHeight : 1;

  window.addEventListener("mousemove", onHandleMouseMove);
  window.addEventListener("mouseup", onHandleMouseUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
};

onBeforeUnmount(stopResizing);
</script>

<style lang="scss" scoped>
.tiptap-image {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  line-height: 0;

  &__img {
    max-width: 100%;
    border-radius: 4px;
  }

  &--selected &__img {
    outline: 2px solid var(--color-primary-600);
    outline-offset: 2px;
  }

  &__thumbnail {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    padding: 3px 10px 3px 10px;
    border-radius: 999px;
    border: 1px solid var(--color-gray-03);
    background-color: var(--color-gray-01);
    box-shadow: var(--shadow-thumbnail);
  }

  &__handle {
    position: absolute;
    z-index: 5;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: white;
    border: 2px solid var(--color-primary-600);

    &--top {
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      cursor: ns-resize;
    }

    &--bottom {
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      cursor: ns-resize;
    }

    &--left {
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: ew-resize;
    }

    &--right {
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: ew-resize;
    }
  }
}
</style>
