<template>
  <div class="flex-1 flex flex-col gap-2">
    <PostFilter with-visibility class="p-2 bg-gray-01 rounded-sm" />
    <div
      v-if="!posts || posts.length === 0"
      class="flex-1 flex items-center justify-center"
    >
      <Empty message="게시글이 없습니다." />
    </div>
    <div v-else class="flex-1 flex flex-col gap-2">
      <div class="flex items-center justify-between px-2">
        <Checkbox
          :model-value="isAllChecked"
          :indeterminate="isIndeterminate"
          label="전체 선택"
          class="shrink-0"
          @update:model-value="toggleAll"
        />
        <PostBulkActions
          v-if="checkedIds.length > 0"
          :selected-ids="checkedIds"
          @done="handleBulkDone"
        />
        <p v-else class="text-sm text-text-gray-02">
          {{ filteredCount.toLocaleString() }} 개
        </p>
      </div>
      <div>
        <AdminPostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :checked="checkedPosts.includes(post.id.toString())"
          :show-delete-button="checkedIds.length === 0"
          @update:checked="handleChecked"
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
  </div>
</template>

<script setup lang="ts">
import { Empty, Checkbox, Pagination } from "@/components/common";
import AdminPostItem from "@/components/features/post/AdminPostItem.vue";
import PostFilter from "@/components/features/post/PostFilter.vue";
import PostBulkActions from "@/components/features/post/PostBulkActions.vue";
import { parseQueryEnum, parseQueryParam } from "@/utils/query-params";
import { POST_VISIBILITIES } from "@/utils/supabase/posts";

const route = useRoute();

const { page, onPageChange } = usePagination();

// 쿼리스트링 기준으로 검색 파라미터 구성 (getter로 넘겨 URL 변경에 반응)
const {
  data: posts,
  filteredCount,
  pageSize,
  refresh,
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

// 게시글 선택 관련
const checkedPosts = ref<string[]>([]);

const isAllChecked = computed(
  () =>
    posts.value.length > 0 && checkedPosts.value.length === posts.value.length
);

const isIndeterminate = computed(
  () => checkedPosts.value.length > 0 && !isAllChecked.value
);

const toggleAll = (checked: boolean) => {
  checkedPosts.value = checked
    ? posts.value.map((post) => post.id.toString())
    : [];
};

const handleChecked = (id: string) => {
  checkedPosts.value = checkedPosts.value.includes(id)
    ? checkedPosts.value.filter((checkedId) => checkedId !== id)
    : [...checkedPosts.value, id];
};

watch(
  () => route.query,
  () => {
    checkedPosts.value = [];
  },
  {
    deep: true,
    immediate: true,
  }
);

// bulk RPC는 number[]를 받으므로 문자열 id를 변환해 전달
const checkedIds = computed(() => checkedPosts.value.map(Number));

// 일괄 처리 후 목록 새로고침 + 선택 초기화
const handleBulkDone = async () => {
  await refresh();
  checkedPosts.value = [];
};
</script>
