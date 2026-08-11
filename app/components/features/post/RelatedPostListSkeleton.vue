<template>
  <div class="px-2 space-y-2">
    <div class="neighbor">
      <Skeleton class="w-11 h-5" />
      <span>:</span>
      <Skeleton class="w-30 h-5" />
    </div>
    <div class="neighbor">
      <Skeleton class="w-11 h-5" />
      <span>:</span>
      <Skeleton class="w-30 h-5" />
    </div>
  </div>
  <hr />
  <div class="space-y-5">
    <p class="ml-2 text-base md:text-lg">관련글</p>
    <div class="related-post-list">
      <PostItemSkeleton v-for="post in 3" :key="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
import PostItemSkeleton from "./PostItemSkeleton.vue";
</script>

<style lang="scss" scoped>
.neighbor {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  color: var(--color-text-gray-03);

  font-size: 14px;
  line-height: calc(1.25 / 0.875) rem;

  @include md {
    font-size: 16px;
    line-height: 1.5rem;
  }

  & > a {
    color: var(--color-text-gray-02);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }
}

.related-post-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  :deep(.post-item) {
    height: 120px;
  }

  @include md {
    grid-template-columns: repeat(3, 1fr);

    :deep(.post-item) {
      height: 360px;
    }
  }
}
</style>
