<script setup lang="ts">
import BlogHeader from "@/components/layout/BlogHeader.vue";

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

useSeoMeta({
  title: "Haein's Blog",
  description: "Haein's Blog",
  ogTitle: "Haein's Blog",
  ogDescription: "Haein's Blog",
  // ogImage: `${siteUrl}/og-image-blog.png`,
  ogUrl: siteUrl,
});
</script>

<template>
  <div class="w-full min-h-screen pt-(--header-height)">
    <BlogHeader />
    <slot />
  </div>
</template>
