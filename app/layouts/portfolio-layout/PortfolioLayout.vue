<script setup lang="ts">
import { PortfolioHeader } from "@/components/layout";

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

<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <PortfolioHeader />
  <slot />
</template>
