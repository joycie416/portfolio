<template>
  <div class="flex-1 flex flex-col gap-2">
    <CommentFilter class="p-2 bg-gray-01 rounded-sm" />
    <template v-if="status === 'pending' || status === 'idle'">
      <CommentDetailItemSkeleton v-for="i in 5" :key="i" />
    </template>
    <div
      v-if="status === 'success' && comments.length === 0"
      class="flex-1 flex items-center justify-center"
    >
      <Empty message="댓글이 없습니다." />
    </div>
    <div
      v-else-if="status === 'success' && comments.length > 0"
      class="flex-1 flex flex-col gap-2"
    >
      <p class="self-end text-sm text-text-gray-02">
        {{ filteredCount.toLocaleString() }} 개
      </p>
      <div>
        <CommentDetailItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          deleteable
          @refresh-comments="refresh"
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
      <Empty message="댓글 조회에 실패했습니다." />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CommentFilter,
  CommentDetailItem,
  CommentDetailItemSkeleton,
} from "@/components/features/comment";
import { parseQueryParam } from "@/utils/query-params";
import { Empty, Pagination } from "@/components/common";

const route = useRoute();

const { page, onPageChange } = usePagination();

const {
  data: comments,
  filteredCount,
  pageSize,
  status,
  refresh,
} = useGetCommentsWithSlug({
  query: () => parseQueryParam(route.query.query) ?? "",
  page,
});
</script>
