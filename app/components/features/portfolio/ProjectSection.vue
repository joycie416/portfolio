<template>
  <section id="projects" class="min-h-screen py-20 bg-primary-200">
    <div
      class="w-full max-w-[1024px] h-full mx-auto py-10 flex flex-col space-y-10"
    >
      <h2 class="text-5xl font-bold tracking-tight">Projects</h2>

      <!-- 프로젝트 리스트 -->
      <div class="project grid grid-cols-2 gap-5">
        <!-- 프로젝트 카드 -->
        <ProjectCard
          v-for="project in PROJECT_DATA"
          :key="project.title"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProjectCard from "./ProjectCard.vue";
import { PROJECT_DATA } from "./projectData.js";
</script>
