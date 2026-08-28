<template>
  <ClientOnly>
    <template v-if="!pending && !error">
      <div class="px-2">
        <div class="neighbor">
          <span class="shrink-0">이전글</span>
          <span>:</span>
          <NuxtLink
            v-if="neighbors?.prev"
            :to="`/blog/${slug}/${neighbors?.prev?.id}`"
          >
            {{ neighbors?.prev?.title }}
          </NuxtLink>
          <span v-else class="empty-text">이전 글이 없습니다.</span>
        </div>
        <div class="neighbor">
          <span class="shrink-0">다음글</span>
          <span>:</span>
          <NuxtLink
            v-if="neighbors?.next"
            :to="`/blog/${slug}/${neighbors?.next?.id}`"
          >
            {{ neighbors?.next?.title }}
          </NuxtLink>
          <span v-else class="empty-text">다음 글이 없습니다.</span>
        </div>
      </div>
      <hr />
      <div class="space-y-5">
        <p class="ml-2 text-base md:text-lg">관련글</p>
        <div class="related-post-list">
          <PostItem v-for="post in recent" :key="post.id" :post="post" />
        </div>
      </div>
    </template>
    <template v-else-if="error">
      <div class="px-2">
        <div class="neighbor">
          <span class="shrink-0">이전글</span>
          <span>:</span>
          <span>조회에 실패했습니다.</span>
        </div>
        <div class="neighbor">
          <span class="shrink-0">다음글</span>
          <span>:</span>
          <span>조회에 실패했습니다.</span>
        </div>
      </div>
      <hr />
      <div class="space-y-5">
        <p class="ml-2 text-base md:text-lg">관련글</p>
        <p class="ml-2 text-text-gray-03 text-sm md:text-base">
          조회에 실패했습니다.
        </p>
      </div>
    </template>
    <template v-else>
      <RelatedPostListSkeleton />
    </template>

    <!-- SSR은 default 슬롯을 비우므로 #fallback으로 서버/클라이언트 DOM을 맞춰야 hydration mismatch가 없다 -->
    <template #fallback>
      <RelatedPostListSkeleton />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import PostItem from "./PostItem.vue";
import RelatedPostListSkeleton from "./RelatedPostListSkeleton.vue";

const route = useRoute();
const postId = computed(() => Number(route.params.id));
const slug = computed(() => route.params.slug as string);

const { neighbors, recent, pending, error } = useGetPostNeighbors({
  postId,
  slug,
});
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
