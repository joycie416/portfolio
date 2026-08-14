<template>
  <main class="h-full w-full max-w-[1024px] p-4 mx-auto md:px-5 md:py-6">
    <Card title="게시글 검색" class="size-full flex flex-col gap-2">
      <div class="flex-1 flex flex-col gap-2">
        <PostFilter class="p-2 bg-gray-01 rounded-sm" />
        <template v-if="status === 'pending' || status === 'idle'">
          <PostItemSkeleton v-for="i in 5" :key="i" variant="horizontal" />
        </template>
        <div
          v-if="status === 'success' && posts.length === 0"
          class="flex-1 flex items-center justify-center"
        >
          <Empty message="게시글이 없습니다." />
        </div>
        <div
          v-else-if="status === 'success' && posts.length > 0"
          class="flex-1 flex flex-col gap-2"
        >
          <p class="self-end text-sm text-text-gray-02">
            {{ filteredCount.toLocaleString() }} 개
          </p>
          <div class="grid auto-rows-[100px] md:auto-rows-[148px] gap-4">
            <PostItem
              v-for="post in posts"
              :key="post.id"
              :post="post"
              variant="horizontal"
              :line-clamp="1"
              :line-clamp-md="2"
              with-menu-tag
            />
          </div>
          <Pagination
            :page="page"
            :total="filteredCount"
            :items-per-page="pageSize"
            class="mt-auto"
            @update:page="onPageChange"
          />
        </div>
        <div v-else class="flex-1 flex items-center justify-center">
          <Empty message="게시글 조회에 실패했습니다." />
        </div>
      </div>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { Empty, Pagination, Card } from "@/components/common";
import PostItem from "@/components/features/post/PostItem.vue";
import PostItemSkeleton from "@/components/features/post/PostItemSkeleton.vue";
import PostFilter from "@/components/features/post/PostFilter.vue";
import { parseQueryEnum, parseQueryParam } from "@/utils/query-params";
import { POST_VISIBILITIES } from "@/utils/supabase/posts";

const route = useRoute();

const { page, onPageChange } = usePagination();

// 쿼리스트링 기준으로 검색 파라미터 구성 (getter로 넘겨 URL 변경에 반응)
const {
  data: posts,
  filteredCount,
  pageSize,
  status,
} = useGetPosts({
  query: () => parseQueryParam(route.query.query) ?? "",
  slug: () => {
    const slug = parseQueryParam(route.query.slug);
    return slug && slug !== "all" ? slug : undefined;
  },
  visibility: () =>
    parseQueryEnum(route.query.visibility, POST_VISIBILITIES, "all"),
  page,
});
</script>
