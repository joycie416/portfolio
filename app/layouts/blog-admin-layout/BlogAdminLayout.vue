<template>
  <div class="w-full min-h-screen pt-(--header-height)">
    <header class="header">
      <button type="button" class="icon" @click="navigateTo('/blog')">
        <SimpleLogo class="size-5 md:size-7 lg:size-8" />
        블로그 관리
      </button>
      <Button v-if="isAuthenticated" type="button" @click="handleSignOut"
        >로그아웃</Button
      >
      <Button v-else type="button" @click="navigateTo('/blog/admin/login')"
        >로그인</Button
      >
    </header>
    <main
      class="w-full max-w-[1024px] min-h-[calc(100vh-var(--header-height))] mx-auto flex flex-col py-5 px-5 space-y-6 lg:py-8 lg:space-y-10"
    >
      <div>
        <div class="flex items-end">
          <NuxtLink
            v-for="menu in ADMIN_MENUS"
            :key="menu.path"
            :to="menu.path"
            class="tab"
            :data-current="currentMenu?.path === menu.path"
          >
            {{ menu.label }}
          </NuxtLink>
        </div>
        <Card class="rounded-tl-none md:rounded-tl-none">
          <slot />
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SimpleLogo from "@/components/ui/logos/SimpleLogo.vue";
import { Button } from "@/components/ui/button";
import { Card } from "~/components/common";

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

useSeoMeta({
  title: "Haein's Blog 블로그 관리",
  description: "Haein's Blog 블로그 관리",
  ogTitle: "Haein's Blog 블로그 관리",
  ogDescription: "Haein's Blog 블로그 관리",
  ogUrl: siteUrl,
});

const route = useRoute();

const { isAuthenticated, signOut } = useAuth();

const handleSignOut = async () => {
  await signOut();
};

interface AdminMenu {
  label: string;
  path: string;
}

const ADMIN_MENUS: AdminMenu[] = [
  {
    label: "메뉴 관리",
    path: "/blog/admin/menus",
  },
  {
    label: "게시글 관리",
    path: "/blog/admin/posts",
  },
  {
    label: "댓글 관리",
    path: "/blog/admin/comments",
  },
];

const currentMenu = computed(() => {
  return ADMIN_MENUS.find((menu) => menu.path === route.path);
});
</script>

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

  background-color: var(--color-white);
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

  @include md {
    font-size: 16px;
  }
  @include lg {
    font-size: 18px;
  }
}
.tab {
  display: inline-block;
  padding: 8px 16px 6px 16px;

  background-color: var(--color-white);
  border: solid 1px var(--color-gray-02);
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  font-size: 16px;
  font-weight: 600;
  color: var(--color-gray-07);

  cursor: pointer;

  &:hover {
    padding-top: 12px;
  }

  &[data-current="true"] {
    padding-top: 12px;
    color: var(--color-primary-600);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: var(--color-primary-600);
    }
  }
}
</style>
