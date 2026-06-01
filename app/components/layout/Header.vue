<script setup lang="ts">
import { Home } from "@lucide/vue";

const route = useRoute();
const currentPath = computed(() => route.path);
const isCurrentPath = (path: string) => {
  if (path === "/") {
    return currentPath.value === "/";
  }
  return currentPath.value.startsWith(path);
};
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="icon">
      <Home />
    </NuxtLink>

    <div class="flex justify-between items-center gap-5">
      <NuxtLink
        to="/components"
        class="text"
        :data-current="isCurrentPath('/components')"
        >Components</NuxtLink
      >
      <NuxtLink to="/components" class="text">Components</NuxtLink>
      <NuxtLink to="/components" class="text" :data-current="isCurrentPath('/')"
        >Components</NuxtLink
      >
      <NuxtLink to="/components" class="text">Components</NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;

  width: 100%;
  height: var(--header-height);

  padding: 8px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: solid 1px var(--color-gray-02);
}
.icon {
  width: 44px;
  height: 44px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 8px;

  transition: background-color 0.2s;
}
.icon:hover {
  background-color: var(--color-gray-01);
}
.text {
  font-weight: 500;
}
.text:hover {
  color: var(--color-primary-400);
}
.text[data-current="true"] {
  color: var(--color-primary-600);
}
.text[data-current="true"]:hover {
  color: var(--color-primary-600);
}
</style>
