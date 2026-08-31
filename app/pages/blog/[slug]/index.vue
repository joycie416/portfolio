<template>
  <BlogInnerLayout :top-image="topImage">
    <template #top>
      <Breadcrumb
        :status="breadcrumbStatus"
        :items="breadcrumbItems"
        type="badge"
        error-message="메뉴 조회에 실패했습니다."
      />
      <h1
        class="text-2xl leading-7.5 font-bold text-center md:text-4xl md:leading-13 my-auto"
      >
        {{ menuFamily?.menu.name }}
      </h1>
      <InputSearch theme="light" class="mx-auto my-auto" />
    </template>
    <template #content>
      <div class="post-list">
        <template v-if="!pending && !error && posts.length > 0">
          <PostItem
            v-for="(post, index) in posts"
            :key="post.id"
            :post="post"
            :loading="index < EAGER_POST_COUNT ? undefined : 'lazy'"
          />
        </template>
        <template v-else-if="pending">
          <PostItemSkeleton v-for="i in 6" :key="i" />
        </template>
        <Empty
          v-else-if="!error && posts.length === 0"
          class="col-span-full h-full min-h-50"
          message="등록된 게시글이 없습니다."
        />
        <Empty
          v-else
          class="col-span-full h-full min-h-50"
          message="게시글 조회에 실패했습니다."
        />
      </div>
      <Pagination
        :page="page"
        :total="filteredCount"
        :items-per-page="PER_PAGE"
        class="mt-auto"
        @update:page="onPageChange"
      />
    </template>
  </BlogInnerLayout>
</template>

<script setup lang="ts">
import { Breadcrumb, Empty, Pagination } from "@/components/common";
import { PostItem, PostItemSkeleton } from "@/components/features/post";
import { BlogInnerLayout } from "@/components/layout";
import { InputSearch } from "@/components/features/blog";
import { menus } from "@/utils/supabase/menus";

definePageMeta({
  middleware: "validate-menu",
});

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { page, onPageChange } = usePagination();

const { breadcrumbItems, breadcrumbStatus, menuFamily } = useMenuBreadcrumb({
  slug,
});

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
// 상단 3개는 eager loading
const EAGER_POST_COUNT = 3;
const {
  data: posts,
  filteredCount,
  pending,
  error,
} = useGetPosts({
  slug,
  page,
  perPage: PER_PAGE,
});

// ------------ 탑 이미지 ------------

const { menuId } = useMenuRoute();
const supabase = useSupabaseClient();

const DEFAULT_TOP_IMAGE = "/images/BackgroundImage01.jpg";
const topImage = ref(DEFAULT_TOP_IMAGE);

watch(
  menuId,
  async (id) => {
    if (!id) {
      topImage.value = DEFAULT_TOP_IMAGE;
      return;
    }

    const thumbnailUrl = await menus(supabase).hasThumbnail(id);
    // 비동기 요청 중 menuId가 바뀌었으면 무시
    if (menuId.value !== id) return;

    topImage.value = thumbnailUrl || DEFAULT_TOP_IMAGE;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.post-list {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.post-item) {
    height: 120px;
  }

  @include md {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    :deep(.post-item) {
      height: 360px;
    }
  }
  @include lg {
    gap: 24px;
  }
}
</style>
