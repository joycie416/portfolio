<template>
  <div class="w-full flex flex-col">
    <TopSection />
    <SkillSection />
  </div>
</template>

<script setup lang="ts">
import { SkillSection, TopSection } from "@/components/features/portfolio";
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
