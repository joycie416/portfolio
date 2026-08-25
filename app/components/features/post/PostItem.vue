<template>
  <Card
    class="p-0 md:p-0 post-item"
    :class="{
      'post-item--vertical': variant === 'vertical',
      'post-item--horizontal': variant === 'horizontal',
    }"
    :style="excerptClampStyle"
    @click="handleClick"
  >
    <div class="post-item__thumbnail">
      <NuxtImg
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        class="size-full object-cover"
      />
      <div v-else class="size-full flex justify-center items-center bg-gray-02">
        <LogoIcon class="size-15" fill="#fff" />
      </div>
    </div>
    <div class="post-item__content">
      <div v-if="withMenuTag" class="post-item__menu-tag">
        {{ post.menu_full_name }}
      </div>
      <h3 class="post-item__title">
        {{ post.title }}
      </h3>
      <p class="post-item__excerpt">
        {{ post.excerpt }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { TransformedPost } from "@/types/supabase";
import { Card } from "@/components/common";
import { LogoIcon } from "@/components/icons";

const props = withDefaults(
  defineProps<{
    post: TransformedPost;
    /** 미지정 시 반응형(모바일 가로 / md+ 세로). vertical은 md+에서만 세로, 모바일은 가로 */
    variant?: "vertical" | "horizontal";
    /** 메뉴명 태그(breadcrumb) 표시 */
    withMenuTag?: boolean;
    /** excerpt line-clamp. 미지정 시 variant별 기본값(기본 4 / horizontal 3 / vertical 3) */
    lineClamp?: number;
    /** md+ excerpt line-clamp. 미지정 시 lineClamp 또는 variant별 기본값(vertical md+ 4) */
    lineClampMd?: number;
  }>(),
  {
    withMenuTag: false,
  }
);

const excerptClampStyle = computed(() => {
  const style: Record<string, number> = {};
  if (props.lineClamp != null) style["--excerpt-line-clamp"] = props.lineClamp;
  if (props.lineClampMd != null)
    style["--excerpt-line-clamp-md"] = props.lineClampMd;
  return style;
});

const handleClick = () => {
  navigateTo(`/blog/${props.post.menu_slug}/${props.post.id}`);
};
</script>

<style lang="scss" scoped>
.post-item {
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  transition:
    transform 0.2s ease-in-out,
    scale 0.2s ease-in-out;
  cursor: pointer;

  // 기본(variant 미지정): 모바일 가로 / md+ 세로 — 높이는 부모에서 제어
  &:not(.post-item--vertical):not(.post-item--horizontal) {
    @include md {
      flex-direction: column;
    }
  }

  &:hover {
    scale: 1.03;
    @include md {
      transform: translateY(-5px);
    }
  }

  &--vertical {
    // 모바일: horizontal과 동일 / md+: 세로 레이아웃
    flex-direction: row;
    height: 100%;
    min-height: 0;

    @include md {
      flex-direction: column;
    }
  }

  &--horizontal {
    flex-direction: row;
    height: 100%;
    min-height: 0;
  }

  &__thumbnail {
    flex: 0 0 30%;
    width: 100%;
    min-height: 0;
    overflow: hidden;

    .post-item--horizontal &,
    .post-item--vertical & {
      flex: 0 0 30%;
      align-self: stretch;
    }

    .post-item--vertical & {
      @include md {
        flex: 1 1 0;
        align-self: auto;
        min-height: 0;
      }
    }
  }

  // 기본 variant: md+에서 세로 레이아웃 썸네일 비율
  &:not(.post-item--vertical):not(.post-item--horizontal) {
    @include md {
      .post-item__thumbnail {
        flex: 0 0 50%;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    width: 100%;
    min-width: 0;
    min-height: 0;
    padding: 12px 16px;
    overflow: hidden;

    @include md {
      padding: 16px;
      gap: 8px;
    }

    .post-item--horizontal &,
    .post-item--vertical & {
      flex: 1 1 70%;
    }

    .post-item--vertical & {
      @include md {
        flex: 0 0 auto;
      }
    }
  }

  &__menu-tag {
    background-color: var(--color-primary-100);
    padding: 4px 8px;
    border-radius: 99px;
    width: fit-content;
    max-width: 100%;

    font-size: 11px;
    line-height: 1.3;
    font-weight: 500;
    color: var(--color-primary-500);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include md {
      font-size: 12px;
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--color-gray-10);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    // 기본: 모바일 1줄, md+ 2줄
    @include md {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      white-space: normal;
      text-overflow: unset;
    }

    .post-item--horizontal & {
      display: block;
      -webkit-line-clamp: unset;
      line-clamp: unset;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .post-item--vertical & {
      // 모바일: horizontal과 동일(1줄) / md+: 2줄
      display: block;
      -webkit-line-clamp: unset;
      line-clamp: unset;
      white-space: nowrap;
      text-overflow: ellipsis;

      @include md {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        white-space: normal;
        text-overflow: unset;
      }
    }

    @include md {
      font-size: 1.125rem;
    }
  }

  &__excerpt {
    --_excerpt-clamp: var(--excerpt-line-clamp, 4);

    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--color-text-gray-03);
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--_excerpt-clamp);
    line-clamp: var(--_excerpt-clamp);

    @include md {
      --_excerpt-clamp: var(
        --excerpt-line-clamp-md,
        var(--excerpt-line-clamp, 4)
      );
      font-size: 0.875rem;
    }

    .post-item--horizontal & {
      --_excerpt-clamp: var(--excerpt-line-clamp, 3);

      @include md {
        --_excerpt-clamp: var(
          --excerpt-line-clamp-md,
          var(--excerpt-line-clamp, 3)
        );
      }
    }

    .post-item--vertical & {
      --_excerpt-clamp: var(--excerpt-line-clamp, 3);

      @include md {
        --_excerpt-clamp: var(
          --excerpt-line-clamp-md,
          var(--excerpt-line-clamp, 4)
        );
      }
    }
  }
}
</style>
