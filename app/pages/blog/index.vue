<template>
  <main class="main">
    <TopSection />
    <PostSection />
    <CommentSection />
  </main>
</template>

<script setup lang="ts">
import {
  CommentSection,
  PostSection,
  TopSection,
} from "@/components/features/blog";
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
}
</style>
