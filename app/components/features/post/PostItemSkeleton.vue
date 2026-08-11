<template>
  <Card
    class="p-0 md:p-0 post-item"
    :class="{
      'post-item--vertical': variant === 'vertical',
      'post-item--horizontal': variant === 'horizontal',
    }"
  >
    <div class="post-item__thumbnail">
      <Skeleton class="size-full rounded-none" />
    </div>
    <div class="post-item__content">
      <Skeleton
        v-if="withMenuTag"
        class="post-item__menu-tag h-5 w-20 md:w-24"
      />
      <Skeleton class="post-item__title h-5 w-4/5 md:h-6" />
      <div class="post-item__excerpt space-y-1.5">
        <Skeleton class="h-3.5 w-full rounded-sm md:h-4" />
        <Skeleton class="h-3.5 w-full rounded-sm md:h-4" />
        <Skeleton class="h-3.5 w-3/4 rounded-sm md:h-4" />
        <!-- md+ vertical·기본: 4줄 / 모바일·horizontal: 3줄 -->
        <Skeleton
          v-if="variant !== 'horizontal'"
          class="h-3.5 w-1/2 rounded-sm md:h-4 max-md:hidden"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/components/common";
import { Skeleton } from "~/components/ui/skeleton";

withDefaults(
  defineProps<{
    /** 미지정 시 반응형(모바일 가로 / md+ 세로). vertical은 md+에서만 세로, 모바일은 가로 */
    variant?: "vertical" | "horizontal";
    /** 메뉴명 태그 스켈레톤 표시 */
    withMenuTag?: boolean;
  }>(),
  {
    withMenuTag: false,
  }
);
</script>

<style lang="scss" scoped>
@layer components {
  .post-item {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    // 기본(variant 미지정): 모바일 가로 / md+ 세로 — 높이는 부모에서 제어
    &:not(.post-item--vertical):not(.post-item--horizontal) {
      @include md {
        flex-direction: column;
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
          flex: 0 0 65%;
          align-self: auto;
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
      gap: 8px;

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
          flex: 0 0 35%;
        }
      }
    }

    &__menu-tag {
      border-radius: 99px;
      width: fit-content;
      max-width: 100%;
      flex-shrink: 0;
    }

    &__title {
      max-width: 100%;
      flex-shrink: 0;
    }

    &__excerpt {
      min-height: 0;
      overflow: hidden;
    }
  }
}
</style>
