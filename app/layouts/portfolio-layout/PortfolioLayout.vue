<script setup lang="ts">
import Header from "@/components/layout/Header.vue";

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

useSeoMeta({
  title: "Haein's Portfolio",
  description: "Haein's Portfolio",
  ogTitle: "Haein's Portfolio",
  ogDescription: "Haein's Portfolio",
  ogImage: `${siteUrl}/og-image-portfolio.png`,
  ogUrl: siteUrl,
});
</script>

<template>
  <Header />
  <slot />
</template>
