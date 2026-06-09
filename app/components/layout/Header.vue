<script setup lang="ts">
import SimpleLogo from "@/components/ui/logos/SimpleLogo.vue";

const route = useRoute();

const sectionIds = ["profile", "skills", "projects"] as const;
const activeSection = ref<(typeof sectionIds)[number] | null>(null);

const scrollToSection = async (id: (typeof sectionIds)[number]) => {
  if (route.path !== "/") {
    await navigateTo("/");
  }
  await nextTick();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // 섹션이 화면에 보이면 해당 섹션의 ID를 activeSection에 저장
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id as (typeof sectionIds)[number];
        }
      }
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );

  // 각 섹션을 관찰 대상으로 등록
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }

  // 언마운트 시 관찰 중단
  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <header class="header">
    <button
      type="button"
      class="icon"
      :data-current="activeSection === 'profile'"
      @click="scrollToSection('profile')"
    >
      <SimpleLogo class="size-5 md:size-7 lg:size-8" />
      Haein
    </button>
    <div class="flex justify-between items-center gap-3 lg:gap-5">
      <button
        type="button"
        class="text"
        :data-current="activeSection === 'profile'"
        @click="scrollToSection('profile')"
      >
        Profile
      </button>
      <button
        type="button"
        class="text"
        :data-current="activeSection === 'skills'"
        @click="scrollToSection('skills')"
      >
        Skills
      </button>
      <button
        type="button"
        class="text"
        :data-current="activeSection === 'projects'"
        @click="scrollToSection('projects')"
      >
        Projects
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;

  width: 100%;
  height: var(--header-height);

  padding: 8px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: var(--color-primary-45);
  border-bottom: solid 1px var(--color-gray-02);

  z-index: 10;
}
.icon {
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 8px;
  transition: background-color 0.2s;

  font-family: var(--font-rix);
  font-size: 16px;
  color: var(--color-primary-800);
  cursor: pointer;

  &:hover {
    background-color: var(--color-gray-01);
  }

  @include md {
    font-size: 20px;
  }
  @include lg {
    font-size: 24px;
  }
}
.text {
  font-size: 14px;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: var(--color-primary-400);
  }

  &[data-current="true"] {
    color: var(--color-primary-600);

    &:hover {
      color: var(--color-primary-600);
    }
  }

  @include md {
    font-size: 16px;
  }
  @include lg {
    font-size: 18px;
  }
}
</style>
