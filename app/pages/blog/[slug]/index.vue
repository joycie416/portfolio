<template>
  <Breadcrumb
    :status="breadcrumbStatus"
    :items="breadcrumbItems"
    error-message="메뉴 조회에 실패했습니다."
  />
  <div class="post-list">
    <PostItem
      v-if="status === 'success' && posts.length > 0"
      v-for="post in posts"
      :key="post.id"
      :post="post"
    />
    <PostItemSkeleton
      v-else-if="status === 'pending'"
      v-for="i in 6"
      :key="i"
    />
    <Empty
      v-else-if="status === 'success' && posts.length === 0"
      class="col-span-full"
      message="등록된 게시글이 없습니다."
    />
    <Empty v-else class="col-span-full" message="게시글 조회에 실패했습니다." />
  </div>
  <Pagination
    :page="page"
    :total="filteredCount"
    :itemsPerPage="PER_PAGE"
    class="mt-auto"
    @update:page="onPageChange"
  />
</template>

<script setup lang="ts">
import { Breadcrumb, Empty, Pagination } from "@/components/common";
import PostItem from "@/components/features/post/PostItem.vue";
import PostItemSkeleton from "@/components/features/post/PostItemSkeleton.vue";

definePageMeta({
  middleware: "validate-menu",
});

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { page, onPageChange } = usePagination();

const { breadcrumbItems, breadcrumbStatus, menuFamily } =
  useMenuBreadcrumb(slug);

// ------------ SEO ------------
const title = computed(() => {
  if (menuFamily.value?.parent) {
    return `${menuFamily.value?.parent.name}/${menuFamily.value?.menu.name} - Haein's Blog`;
  }
  return `${menuFamily.value?.menu.name} - Haein's Blog`;
});

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

useSeoMeta({
  title,
  description: title.value,
  ogTitle: title.value,
  ogDescription: title.value,
  ogImage: `${siteUrl}/og-image-blog.png`,
  ogUrl: `${siteUrl}/blog/${menuFamily.value?.menu.slug}`,
});

// ------------ 게시글 조회 ------------
const PER_PAGE = 12;
const {
  data: posts,
  filteredCount,
  status,
} = useGetPosts({
  slug: menuFamily.value?.menu.slug ?? "", // slug가 없으면
  page,
  perPage: PER_PAGE,
});
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  @include md {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @include lg {
    gap: 24px;
  }
}
</style>
