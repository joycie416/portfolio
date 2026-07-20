<template>
  <node-view-wrapper
    class="tiptap-image"
    :class="{ 'tiptap-image--selected': selected }"
  >
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      :width="node.attrs.width"
      :height="node.attrs.height"
      :data-inline-key="node.attrs['data-inline-key']"
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
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { Toggle } from "@/components/common";

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
</script>

<style lang="scss" scoped>
.tiptap-image {
  position: relative;
  display: inline-block;
  max-width: 100%;
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
}
</style>
