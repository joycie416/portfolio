<template>
  <section id="skills" class="skill-section">
    <div class="skill-section__container">
      <div>
        <h2 class="skill-section__title">Skills</h2>
        <p class="skill-section__description">
          새로운 기술을 빠르게 학습하고, 실제 서비스에 적용하는 것을 좋아합니다.
        </p>
      </div>

      <div class="skill">
        <article
          v-for="group in skillSets"
          :key="group.title"
          class="skill__card"
          :class="{ 'md:col-span-2': group.title === 'Forms & Utilities' }"
        >
          <div class="mb-4 flex items-center gap-4 md:mb-5">
            <div
              class="skill__card__icon"
              :style="{
                '--skill-group-color': `var(--skill-group-${group.color})`,
              }"
            >
              <component :is="group.icon" />
            </div>

            <h3 class="text-xl font-bold md:text-[22px] lg:text-2xl">
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
import type { SkillGroup } from "@/types/common";
import { CodeXml, Command, Database, Layers, Paintbrush } from "@lucide/vue";
import SkillBadge from "./SkillBadge.vue";

const skillSets: SkillGroup[] = [
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
.skill-section {
  min-height: fit-content;
  padding: 40px 20px;
  background-color: var(--color-primary-100);

  @include lg {
    min-height: 100vh;
    padding: 80px 0;
  }

  &__container {
    width: 100%;
    max-width: 1024px;
    height: 100%;
    margin-inline: auto;
    padding-block: 20px;

    display: flex;
    flex-direction: column;

    > * + * {
      margin-top: 24px;
    }

    @include lg {
      padding-block: 40px;

      > * + * {
        margin-top: 40px;
      }
    }
  }

  &__title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    letter-spacing: -0.025em;

    @include md {
      font-size: 30px;
      line-height: 36px;
    }
    @include lg {
      font-size: 48px;
      line-height: 1;
    }
  }

  &__description {
    margin-top: 12px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--color-text-gray-02);

    @include md {
      font-size: 16px;
      line-height: 24px;
    }
    @include lg {
      margin-top: 20px;
      font-size: 18px;
      line-height: 28px;
    }
  }
}

.skill {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @include md {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @include lg {
    gap: 28px;
  }

  &__card {
    padding: 20px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 20px;
    background: var(--color-primary-50);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(8px);

    @include md {
      padding: 24px 28px;
      border-radius: 24px;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      --skill-group-color: var(--color-gray-05);
      border: 0.5px solid transparent;
      border-color: color-mix(
        in srgb,
        var(--skill-group-color) 10%,
        transparent
      );
      background-color: color-mix(in srgb, var(--skill-group-color) 12%, white);
      color: var(--skill-group-color);

      @include md {
        width: 40px;
        height: 40px;
      }

      @include lg {
        width: 52px;
        height: 52px;
      }

      svg {
        width: 16px;
        height: 16px;

        @include md {
          width: 20px;
          height: 20px;
        }

        @include lg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
