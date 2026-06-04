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
          v-for="project in dummyProjects"
          :key="project.title"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from "@/types/index.js";
import ProjectCard from "./ProjectCard.vue";

const dummyProject: Project = {
  title: "Project Title",
  description:
    "Project DescriptionProject DescriptionProject Description Project Description",
  contributions: [
    "Contribution 1",
    "Contribution 2 Contribution 2 Contribution2Contribution2Contribution 2 ",
    "Contribution 3",
    "Contribution 4",
  ],
  skills: [
    { name: "React", color: "react" },
    { name: "Next.js", color: "nextjs" },
    { name: "TypeScript", color: "typescript" },
    { name: "Tailwind CSS", color: "tailwind-css" },
    { name: "Shadcn UI", color: "shadcn-ui" },
    { name: "Supabase", color: "supabase" },
    { name: "Zustand", color: "zustand" },
    { name: "Recoil", color: "recoil" },
  ],
  links: [
    { type: "github", url: "https://github.com", text: "GitHub" },
    { type: "demo", url: "https://demo.com", text: "Demo" },
    { type: "doc", url: "https://doc.com", text: "Doc" },
    { type: "link", url: "https://link.com", text: "Link" },
  ],
};
const dummyProjects: Project[] = [dummyProject, dummyProject, dummyProject];
</script>
