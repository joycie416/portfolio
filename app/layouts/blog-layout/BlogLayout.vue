<template>
  <div class="layout">
    <BlogHeader
      :is-sidebar-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />
    <div class="layout__body">
      <Sidebar :open="isSidebarOpen" />
      <!-- 사이드바 오버레이 -->
      <div
        v-if="isSidebarOpen"
        class="layout__backdrop"
        @click="closeSidebar"
      />
      <div class="layout__page">
        <slot />
        <Footer />
      </div>
      <NuxtLink
        v-if="isAuthenticated"
        to="/blog/admin/posts/new"
        class="create-post-button"
      >
        <Plus />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlogHeader, Footer, Sidebar } from "@/components/layout";
import { Plus } from "@lucide/vue";

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

useSeoMeta({
  title: "Haein's Blog",
  description: "Haein's Blog",
  ogTitle: "Haein's Blog",
  ogDescription: "Haein's Blog",
  ogImage: `${siteUrl}/og-image-blog.png`,
  ogUrl: siteUrl,
});

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const { isAuthenticated } = useAuth();
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  min-height: 100vh;
  padding-top: var(--header-height);

  &__body {
    width: 100%;
    min-height: calc(100vh - var(--header-height));

    display: flex;
    align-items: stretch;
  }

  // 사이드바 옆에서 slot + footer를 세로로 쌓음
  &__page {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
  }

  &__backdrop {
    position: fixed;
    inset: var(--header-height) 0 0 0;
    z-index: 4;

    background: color-mix(in srgb, var(--color-gray-10) 60%, transparent);

    // 데스크톱에서는 사이드바가 오버레이가 아니므로 backdrop 불필요
    @include md {
      display: none;
    }
  }
}
.create-post-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 5;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 50%;
  padding: 10px;
  z-index: 3;

  @include md {
    bottom: 20px;
    right: 20px;
    padding: 12px;
  }
}
</style>
