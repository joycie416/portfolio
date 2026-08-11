<template>
  <div class="post-groups">
    <div
      v-for="(group, groupIndex) in skeletonGroups"
      :key="groupIndex"
      class="post-group"
      :class="
        group.featuredSide === 'left'
          ? 'post-group--featured-left'
          : 'post-group--featured-right'
      "
    >
      <PostItemSkeleton variant="vertical" with-menu-tag />
      <PostItemSkeleton
        v-for="i in group.compactCount"
        :key="i"
        variant="horizontal"
        with-menu-tag
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostItemSkeleton from "@/components/features/post/PostItemSkeleton.vue";

const skeletonGroups = [
  { featuredSide: "left" as const, compactCount: 3 },
  { featuredSide: "right" as const, compactCount: 3 },
];
</script>

<style lang="scss" scoped>
.post-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include md {
    gap: 24px;
  }
}

.post-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  // 모바일: 이미지/내용과 무관하게 row 높이 고정
  :deep(.post-item) {
    height: 140px;
  }

  @include md {
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 20px;
    min-height: 520px;

    :deep(.post-item) {
      height: 100%;
    }
  }

  &--featured-left {
    @include md {
      grid-template-columns: 2fr 3fr;

      > :first-child {
        grid-column: 1;
        grid-row: 1 / 4;
      }
    }
  }

  &--featured-right {
    @include md {
      grid-template-columns: 3fr 2fr;

      > :first-child {
        grid-column: 2;
        grid-row: 1 / 4;
      }
    }
  }
}
</style>
