<template>
  <div
    class="project__card flex flex-col p-7 pb-6 bg-primary-50 border border-gray-02 rounded-3xl"
  >
    <!-- 프로젝트 제목 -->
    <p class="text-2xl font-bold mb-3">{{ props.project.title }}</p>
    <!-- 프로젝트 설명 -->
    <p class="text-text-gray-02 mb-4">{{ props.project.description }}</p>
    <!-- 기여 -->
    <ul class="space-y-1.5 mb-5">
      <li
        v-for="(contribution, index) in props.project.contributions"
        :key="`contribution-${index + 1}`"
      >
        {{ contribution }}
      </li>
    </ul>
    <!-- 기술 스택 -->
    <div class="flex flex-wrap gap-2">
      <SkillBadge
        v-for="skill in props.project.skills"
        :key="skill.name"
        :skill="skill"
      />
    </div>
    <!-- 링크 -->
    <div v-if="props.project.links" class="flex items-center gap-x-2.5 mt-6">
      <div
        v-for="link in props.project.links"
        :key="link.url"
        class="project__card__link h-fit"
      >
        <Button variant="ghost" class="h-5 px-1 py-0">
          <NuxtImg
            v-if="link.type === 'github'"
            src="/icons/github-logo.svg"
            alt="github"
            width="20"
            height="20"
          />
          <SquareArrowOutUpLeft
            v-if="link.type === 'demo'"
            width="20"
            height="20"
            class="w-5 h-5"
          />
          <BookText
            v-if="link.type === 'doc'"
            width="20"
            height="20"
            class="w-5 h-5"
          />
          <Link2
            v-if="link.type === 'link'"
            width="20"
            height="20"
            class="w-5 h-5"
          />
          <a :href="link.url" target="_blank">{{ link.text }}</a>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button/index.js";
import SkillBadge from "./SkillBadge.vue";
import type { Project } from "@/types/index.js";
import { BookText, Link2, SquareArrowOutUpLeft } from "@lucide/vue";

const props = defineProps<{ project: Project }>();
</script>

<style lang="scss" scoped>
.project {
  &__card {
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(8px);

    ul {
      list-style: disc;
      padding-left: 16px;
      color: var(--color-text-gray-02);

      li::marker {
        color: var(--color-primary-700);
      }
    }
    &__link {
      &:not(:first-child) {
        padding-left: 10px;
        border-left: 1px solid var(--color-gray-02);
      }
    }
  }
}
</style>
