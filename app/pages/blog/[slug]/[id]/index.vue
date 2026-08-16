<template>
  <BlogInnerLayout :top-image="post?.thumbnail ?? undefined">
    <template #top>
      <div class="size-full min-w-0 flex flex-col justify-between items-center">
        <Breadcrumb
          :status="breadcrumbStatus"
          :items="breadcrumbItems"
          type="badge"
          error-message="메뉴 조회에 실패했습니다."
        />
        <h1
          class="text-2xl leading-7.5 font-bold text-center md:text-4xl md:leading-13"
        >
          {{ post?.title }}
        </h1>
        <PostMeta
          v-if="post"
          :post="post"
          type="badge"
          @refresh-post="refresh"
        />
      </div>
    </template>
    <template #content>
      <!-- 첨부파일 -->
      <DropdownMenu v-if="files?.attachments && files.attachments.length > 0">
        <DropdownMenuTrigger
          class="flex items-center gap-0.5 md:gap-1 text-sm md:text-base self-end hover:underline"
        >
          첨부파일
          <Save class="size-4 md:size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          class="w-100 flex flex-col gap-1.5 p-2"
        >
          <FileItem
            v-for="file in files?.attachments"
            :key="file.key"
            :file="{ name: file.key, size: file.size ?? 0 }"
            :href="file.url"
            :removable="false"
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <!-- 게시글 본문 -->
      <div
        ref="contentRef"
        v-html="post?.content"
        class="tiptap tiptap--readonly"
      />
      <!-- 날짜, 공유, 관리자 기능 -->
      <PostMeta
        v-if="post"
        :post="post"
        type="default"
        @refresh-post="refresh"
      />
      <!-- 태그 목록 -->
      <ul v-if="post?.tags && post.tags.length > 0" class="tag__list">
        <li
          v-for="tag in post?.tags"
          :key="tag"
          class="tag__item"
          @click="() => onTagClick(tag)"
        >
          {{ tag }}
        </li>
      </ul>
      <!-- 게시글 하단 -->
      <hr class="border border-px border-gray-06" />
      <RelatedPostList />
      <CommentSection :post-id="postId" />
    </template>
  </BlogInnerLayout>
</template>

<script setup lang="ts">
import { Breadcrumb, FileItem } from "@/components/common";
import { BlogInnerLayout } from "@/components/layout";
import { CommentSection } from "@/components/features/comment";
import { PostMeta, RelatedPostList } from "@/components/features/post";
import { Save } from "@lucide/vue";

definePageMeta({
  middleware: "validate-post",
});

const route = useRoute();
const postId = computed(() => Number(route.params.id));

const { breadcrumbItems, breadcrumbStatus } = useMenuBreadcrumb(
  () => route.params.slug as string
);

const { data, refresh } = useGetPost({
  id: postId.value,
  immediate: true,
});
const post = computed(() => data.value?.post);
const files = computed(() => data.value?.files);

const contentRef = ref<HTMLDivElement | null>(null);
useTiptapCodeHighlight(
  contentRef,
  computed(() => post.value?.content)
);

// ------------ SEO ------------
const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

const title = computed(() => {
  if (post.value?.title) {
    return `${post.value.title} - Haein's Blog`;
  }
  return "Haein's Blog";
});
const ogImage = computed(() => {
  if (post.value?.thumbnail) {
    return post.value.thumbnail;
  }
  return `${siteUrl}/og-image-blog.png`;
});

useSeoMeta({
  title,
  description: post.value?.excerpt,
  ogTitle: post.value?.title,
  ogDescription: post.value?.excerpt,
  ogImage,
  ogUrl: `${siteUrl}/blog/${route.params.slug}/${route.params.id}`,
});

const onTagClick = (tag: string) => {
  navigateTo(`/blog/search?query=${tag}`);
};
</script>

<style lang="scss" scoped>
.tag {
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__item {
    padding: 2px 8px;
    background-color: white;
    border: 1px solid var(--color-primary-200);
    border-radius: 99px;
    font-size: 12px;
    color: var(--color-primary-300);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    &::before {
      content: "#";
    }

    @include md {
      padding: 2px 8px;
      font-size: 14px;
    }
  }
}
</style>
