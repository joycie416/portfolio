<template>
  <div class="w-full min-h-screen pt-(--header-height)">
    <header class="header">
      <button type="button" class="icon" @click="navigateTo('/blog')">
        <SimpleLogo class="size-5 md:size-7 lg:size-8" />
        블로그 관리
      </button>
    </header>
    <main
      class="w-full max-w-[1024px] min-h-[calc(100vh-var(--header-height))] mx-auto flex flex-col py-5 px-5 space-y-6 lg:py-8 lg:space-y-10"
    >
      <div class="flex-1 flex flex-col">
        <div class="flex items-end gap-1">
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
        <Card class="flex-1 flex flex-col rounded-tl-none md:rounded-tl-none">
          <slot />
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { SimpleLogo } from "@/components/logos";
import { Card } from "@/components/common";

const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

const route = useRoute();

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

const currentMenu = computed<AdminMenu>(
  () =>
    ADMIN_MENUS.find((menu) => route.path.startsWith(menu.path)) ||
    ADMIN_MENUS[0]!
);

useSeoMeta({
  title: `Haein's Blog 블로그 관리 - ${currentMenu.value.label}`,
  description: "Haein's Blog 블로그 관리",
  ogTitle: "Haein's Blog 블로그 관리",
  ogDescription: "Haein's Blog 블로그 관리",
  ogUrl: siteUrl,
});

// 관리자 페이지 접근 시 메뉴 목록 조회: 1회만 조회해 공유하기 위함
useGetMenus();
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;

  width: 100%;
  height: var(--header-height);

  padding: 8px 20px 8px 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: var(--color-white);
  border-bottom: solid 1px var(--color-gray-02);

  z-index: 10;

  @include md {
    padding-left: 16px;
  }
  @include lg {
    padding-left: 20px;
  }
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
.tab {
  display: inline-block;
  padding: 6px 12px 4px 12px;

  background-color: var(--color-primary-300);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  font-size: 14px;
  font-weight: 500;
  color: var(--color-white);

  box-shadow: var(--shadow-sm);
  cursor: pointer;

  &:hover {
    padding-top: 8px;

    @include md {
      padding-top: 12px;
    }
  }

  &[data-current="true"] {
    padding-top: 8px;
    font-weight: 600;
    color: var(--color-primary-600);
    position: relative;
    overflow: hidden;

    background-color: var(--color-white);
    box-shadow: none;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-primary-600);

      @include md {
        height: 4px;
      }
    }

    @include md {
      padding-top: 12px;
    }
  }

  @include md {
    padding: 8px 16px 6px 16px;
  }
  @include lg {
    font-size: 16px;
  }
}
</style>
