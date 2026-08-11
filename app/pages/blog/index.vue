<template>
  <main class="main">
    <TopSection />
    <PostSection />
  </main>
</template>

<script setup lang="ts">
import { PostSection, TopSection } from "@/components/features/blog";
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
}
</style>
