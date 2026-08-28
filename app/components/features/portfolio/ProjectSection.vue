<template>
  <section id="projects" class="project-section">
    <div class="project-section__container">
      <h2 class="project-section__title">Projects</h2>

      <!-- 프로젝트 리스트 -->
      <div class="project-section__list">
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

<style lang="scss" scoped>
.project-section {
  min-height: fit-content;
  padding: 40px 20px;
  background-color: var(--color-primary-200);

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

  &__list {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 16px;

    @include md {
      gap: 20px;
    }
    @include lg {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 28px;
    }
  }
}
</style>
