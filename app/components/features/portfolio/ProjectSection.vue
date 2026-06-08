<template>
  <section
    id="projects"
    class="min-h-screen bg-primary-200 px-5 py-10 md:min-h-fit lg:min-h-screen lg:px-0 lg:py-20"
  >
    <div
      class="w-full max-w-[1024px] h-full flex flex-col mx-auto py-5 space-y-6 lg:py-10 lg:space-y-10"
    >
      <h2 class="text-2xl font-bold tracking-tight md:text-3xl lg:text-5xl">
        Projects
      </h2>

      <!-- 프로젝트 리스트 -->
      <div class="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 lg:gap-7">
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
