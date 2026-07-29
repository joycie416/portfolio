<template>
  <div>
    <Breadcrumb
      :status="breadcrumbStatus"
      :items="breadcrumbItems"
      error-message="메뉴 조회에 실패했습니다."
    />
    <div
      ref="contentRef"
      v-html="post?.content"
      class="tiptap tiptap--readonly"
    />
  </div>
</template>

<script setup lang="ts">
import { Breadcrumb } from "@/components/common";

const route = useRoute();

const { breadcrumbItems, breadcrumbStatus } = useMenuBreadcrumb(
  () => route.params.slug as string
);

const { data } = useGetPost({ id: Number(route.params.id), immediate: true });
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
</script>
