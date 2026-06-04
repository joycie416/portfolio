<template>
  <section id="skills" class="min-h-screen py-20 bg-primary-100">
    <div
      class="w-full max-w-[1024px] h-full mx-auto py-10 flex flex-col space-y-10"
    >
      <div class="mb-12">
        <h2 class="text-5xl font-bold tracking-tight">Skills</h2>
        <p class="mt-5 max-w-[520px] text-lg font-medium text-gray-600">
          새로운 기술을 빠르게 학습하고, 실제 서비스에 적용하는 것을 좋아합니다.
        </p>
      </div>

      <div class="skill grid grid-cols-1 gap-6 md:grid-cols-2">
        <article
          v-for="group in skillSets"
          :key="group.title"
          class="skill__card"
          :class="{ 'md:col-span-2': group.title === 'Forms & Utilities' }"
        >
          <div class="mb-5 flex items-center gap-4">
            <div
              class="skill__card__icon"
              :style="{
                '--skill-group-color': `var(--skill-group-${group.color})`,
              }"
            >
              <component :is="group.icon" />
            </div>

            <h3 class="text-2xl font-bold">
              {{ group.title }}
            </h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <SkillBadge
              v-for="skill in group.skills"
              :key="skill.name"
              :skill="skill"
              size="lg"
            />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CodeXml, Command, Database, Layers, Paintbrush } from "@lucide/vue";
import type { Component } from "vue";
import SkillBadge from "./SkillBadge.vue";

interface Skill {
  name: string;
  color: string;
}

interface Group {
  title: string;
  icon: Component;
  color: string;
  skills: Skill[];
}

const skillSets: Group[] = [
  {
    title: "Languages",
    icon: CodeXml,
    color: "languages",
    skills: [
      { name: "TypeScript", color: "typescript" },
      { name: "JavaScript", color: "javascript" },
      { name: "Python", color: "python" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: Layers,
    color: "frameworks",
    skills: [
      { name: "Next.js", color: "nextjs" },
      { name: "Nuxt", color: "nuxt" },
      { name: "React", color: "react" },
      { name: "Vue3", color: "vue" },
    ],
  },
  {
    title: "Data & State Management",
    icon: Database,
    color: "data-state",
    skills: [
      { name: "TanStack Query", color: "tanstack-query" },
      { name: "Zustand", color: "zustand" },
      { name: "Recoil", color: "recoil" },
      { name: "Axios", color: "axios" },
      { name: "Supabase", color: "supabase" },
    ],
  },
  {
    title: "UI & Styling",
    icon: Paintbrush,
    color: "ui-styling",
    skills: [
      { name: "Shadcn UI", color: "shadcn-ui" },
      { name: "Tailwind CSS", color: "tailwind-css" },
      { name: "SCSS", color: "scss" },
    ],
  },
  {
    title: "Forms & Utilities",
    icon: Command,
    color: "forms-utilities",
    skills: [
      { name: "React Hook Form", color: "react-hook-form" },
      { name: "Zod", color: "zod" },
      { name: "dayjs", color: "dayjs" },
    ],
  },
];
</script>

<style lang="scss" scoped>
.skill {
  &__card {
    padding: 24px 28px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.56);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(8px);

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 999px;
      font-size: 18px;
      font-weight: 800;

      --skill-group-color: var(--color-gray-05);
      border: 0.5px solid transparent;
      border-color: color-mix(
        in srgb,
        var(--skill-group-color) 10%,
        transparent
      );
      background-color: color-mix(in srgb, var(--skill-group-color) 12%, white);
      color: var(--skill-group-color);
    }
  }
}
</style>
