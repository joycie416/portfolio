<script setup lang="ts">
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
  justify-content: end;
  align-items: center;

  background-color: var(--color-primary-45);
  border-bottom: solid 1px var(--color-gray-02);

  z-index: 10;
}
.icon {
  width: 44px;
  height: 44px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 8px;

  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-gray-01);
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
