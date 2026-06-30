<template>
  <div class="flex-1 flex flex-col gap-2">
    <PostFilter v-model="searchForm" class="p-2 bg-gray-01 rounded-sm" />
    <div
      v-if="!posts || posts.length === 0"
      class="flex-1 flex items-center justify-center"
    >
      <Empty message="게시글이 없습니다." />
    </div>
    <div v-else class="flex flex-col gap-2">
      <div class="px-2">
        <Checkbox
          :model-value="isAllChecked"
          :indeterminate="isIndeterminate"
          label="전체 선택"
          @update:model-value="toggleAll"
        />
      </div>
      <div>
        <AdminPostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :checked="checkedPosts.includes(post.id.toString())"
          @update:checked="handleChecked"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Empty, Checkbox } from "@/components/common";
import type { TransformedPost } from "@/types/supabase";
import AdminPostItem from "@/components/features/post/AdminPostItem.vue";
import type { PostFilterForm } from "@/types/post";
import PostFilter from "~/components/features/post/PostFilter.vue";

const posts: TransformedPost[] = [
  {
    content: "test content",
    created_at: new Date().toISOString(),
    hidden: false,
    id: 1,
    menu_id: "1",
    modified_at: new Date().toISOString(),
    tags: ["test"],
    title: "test title",
    title_image: "test",
    menu_full_name: "test",
  },
  {
    content: "test content 2",
    created_at: new Date().toISOString(),
    hidden: true,
    id: 2,
    menu_id: "1",
    modified_at: new Date().toISOString(),
    tags: ["test"],
    title: "test title 2",
    title_image: "test",
    menu_full_name: "test/today",
  },
];

// 게시글 선택 관련
const checkedPosts = ref<string[]>([]);

const isAllChecked = computed(
  () => posts.length > 0 && checkedPosts.value.length === posts.length
);

const isIndeterminate = computed(
  () => checkedPosts.value.length > 0 && !isAllChecked.value
);

const toggleAll = (checked: boolean) => {
  checkedPosts.value = checked ? posts.map((post) => post.id.toString()) : [];
};

const handleChecked = (id: string) => {
  checkedPosts.value = checkedPosts.value.includes(id)
    ? checkedPosts.value.filter((checkedId) => checkedId !== id)
    : [...checkedPosts.value, id];
};

// 검색 필터 관련
const searchForm = ref<PostFilterForm>({
  query: "",
  visibility: "all",
  menuId: "all",
});
</script>
