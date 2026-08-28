<template>
  <section id="post" class="post-section">
    <InputSearch theme="gray" class="mx-auto mb-10" />
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
        :class="`post-group--${group.variant}`"
      >
        <PostItem
          v-for="item in group.items"
          :key="item.post.id"
          :post="item.post"
          :variant="item.featured ? 'vertical' : 'horizontal'"
          :class="{ 'post-group__featured': item.featured }"
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
import InputSearch from "./InputSearch.vue";

type PostGroupItem = {
  post: TransformedPost;
  featured: boolean;
};

type PostGroup = {
  variant: "featured-left" | "featured-right" | "compact-only";
  items: PostGroupItem[];
};

const GROUP_SIZE = 4;

const {
  data: posts,
  pending,
  error,
} = useGetPosts({
  perPage: GROUP_SIZE * 2,
  page: 1,
});

const postGroups = computed<PostGroup[]>(() => {
  const list = posts.value ?? [];
  const groups: PostGroup[] = [];

  const first = list.slice(0, GROUP_SIZE);
  if (first.length > 0) {
    groups.push({
      variant: "featured-left",
      items: first.map((post, index) => ({ post, featured: index === 0 })),
    });
  }

  const second = list.slice(GROUP_SIZE, GROUP_SIZE * 2);
  if (second.length > 0) {
    // 두 번째 그룹은 4개가 모두 채워질 때만 마지막 글을 오른쪽 대표 카드로 배치하고,
    // 그 전까지는 왼쪽 열에 위에서부터 채운다.
    const hasFeatured = second.length === GROUP_SIZE;
    groups.push({
      variant: hasFeatured ? "featured-right" : "compact-only",
      items: second.map((post, index) => ({
        post,
        featured: hasFeatured && index === second.length - 1,
      })),
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

      .post-group__featured {
        grid-column: 1;
        grid-row: 1 / 4;
      }
    }
  }

  &--featured-right {
    @include md {
      grid-template-columns: 3fr 2fr;

      .post-group__featured {
        grid-column: 2;
        grid-row: 1 / 4;
      }
    }
  }

  // 대표 카드 없이 왼쪽 열에만 위에서부터 쌓이는 그룹
  &--compact-only {
    @include md {
      grid-template-columns: 3fr 2fr;
      grid-template-rows: none;
      grid-auto-rows: 160px;
      min-height: 0;

      > :deep(.post-item) {
        grid-column: 1;
      }
    }
  }
}
</style>
