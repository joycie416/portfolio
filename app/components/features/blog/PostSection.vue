<template>
  <section id="post" class="post-section">
    <h2 class="post-section__title">최신글</h2>

    <Empty
      v-if="!pending && !error && postGroups.length === 0"
      message="등록된 게시글이 없습니다."
      class="h-120"
    />
    <Empty
      v-else-if="!pending && error"
      message="게시글 조회에 실패했습니다."
      class="h-120"
    />
    <PostSectionSkeleton v-else-if="pending" />
    <div v-else-if="postGroups.length > 0" class="post-groups">
      <div
        v-for="(group, groupIndex) in postGroups"
        :key="groupIndex"
        class="post-group"
        :class="
          group.featuredSide === 'left'
            ? 'post-group--featured-left'
            : 'post-group--featured-right'
        "
      >
        <PostItem
          v-if="group.featured"
          :post="group.featured"
          variant="vertical"
          with-menu-tag
        />
        <PostItem
          v-for="post in group.compact"
          :key="post.id"
          :post="post"
          variant="horizontal"
          with-menu-tag
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TransformedPost } from "@/types/supabase";
import { Empty } from "@/components/common";
import { PostItem } from "@/components/features/post";
import { PostSectionSkeleton } from "./";

type PostGroup = {
  featuredSide: "left" | "right";
  featured: TransformedPost;
  compact: TransformedPost[];
};

const {
  data: posts,
  pending,
  error,
} = useGetPosts({
  perPage: 8,
  page: 1,
  visibility: "public",
});

const postGroups = computed<PostGroup[]>(() => {
  const list = posts.value ?? [];
  const groups: PostGroup[] = [];

  const first = list.slice(0, 4);
  if (first[0]) {
    groups.push({
      featuredSide: "left",
      featured: first[0],
      compact: first.slice(1),
    });
  }

  const second = list.slice(4, 8);
  if (second[0]) {
    groups.push({
      featuredSide: "right",
      featured: second[0],
      compact: second.slice(1),
    });
  }

  return groups;
});
</script>

<style lang="scss" scoped>
.post-section {
  width: 100%;
  max-width: 1024px;
  height: fit-content;
  min-height: fit-content;
  margin: 0 auto;
  padding: 40px 20px 64px;

  @include md {
    padding: 56px 24px 80px;
  }

  &__title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-gray-10);

    @include md {
      margin-bottom: 28px;
      font-size: 28px;
    }
  }
}

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
