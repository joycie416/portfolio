<template>
  <div class="w-full flex flex-col">
    <ProfileSection />
    <SkillSection />
    <ProjectSection />
  </div>
</template>

<script setup lang="ts">
import {
  SkillSection,
  ProfileSection,
  ProjectSection,
} from "@/components/features/portfolio";
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
