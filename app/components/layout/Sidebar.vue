<template>
  <aside class="sidebar" :data-open="props.open">
    <div class="sidebar__content">
      <div class="sidebar__header">
        <NuxtLink class="font-rix" to="/portfolio">Portfolio</NuxtLink>
      </div>
      <Accordion
        v-if="status === 'success'"
        type="multiple"
        collapsible
        :class="props.open ? 'block' : 'hidden'"
      >
        <AccordionItem
          v-for="parent in menus"
          :key="parent.id"
          :value="parent.id"
          class="menu__item"
        >
          <NuxtLink
            v-if="parent.children.length === 0"
            :to="`/blog/${parent.slug}`"
            prefetch-on="interaction"
            class="menu__parent"
          >
            {{ parent.name }} ({{ parent.postCount.toLocaleString() }})
          </NuxtLink>
          <AccordionTrigger
            v-else
            class="hover:no-underline"
            :class="{
              '[&_.lucide-chevron-down-icon]:hidden':
                parent.children.length === 0,
            }"
          >
            <NuxtLink
              :to="`/blog/${parent.slug}`"
              prefetch-on="interaction"
              class="block w-1/2 shrink-0 truncate hover:underline"
            >
              {{ parent.name }} ({{ parent.postCount.toLocaleString() }})
            </NuxtLink>
          </AccordionTrigger>
          <AccordionContent v-if="parent.children.length > 0" class="pl-6">
            <ul>
              <li v-for="child in parent.children" :key="child.id">
                <NuxtLink
                  :to="`/blog/${child.slug}`"
                  prefetch-on="interaction"
                  class="menu__child"
                >
                  {{ child.name }} ({{ child.postCount.toLocaleString() }})
                </NuxtLink>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <!-- 메뉴 로딩 -->
      <div v-else-if="status === 'pending'" class="space-y-1">
        <Skeleton v-for="i in 5" :key="i" class="w-full h-13 rounded-[12px]" />
      </div>
      <!-- 메뉴 에러 -->
      <div v-else class="w-full px-3 py-4">
        <p class="text-sm text-text-gray-04">메뉴를 불러오지 못했습니다.</p>
        <button
          class="text-sm text-text-gray-04 underline cursor-pointer py-1 flex items-center gap-1"
          @click="() => refresh()"
        >
          <RotateCcw class="size-4" />
          다시 시도
        </button>
      </div>
      <div class="sidebar__footer">
        <NuxtLink
          v-if="!isAuthenticated"
          class="admin__button"
          to="/blog/admin/login"
        >
          <LockKeyhole class="size-5" />
          <span class="admin__button__text">관리자 로그인</span>
        </NuxtLink>
        <div v-else class="admin">
          <NuxtLink class="admin__button" to="/blog/admin">
            <Settings class="size-5" />
            <span class="admin__button__text">설정</span>
          </NuxtLink>

          <button class="admin__button cursor-pointer" @click="handleSignOut">
            <LogOut class="size-5" />
            <span class="admin__button__text">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LockKeyhole, LogOut, RotateCcw, Settings } from "@lucide/vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const { isAuthenticated, signOut } = useAuth();

const { data, status, refresh } = useGetMenus();

const menus = computed(() => buildMenuTree(data.value ?? []));

const handleSignOut = async () => {
  await signOut();
  // 로그아웃 후 새로고침해 데이터에 rls가 다시 적용되도록 함
  reloadNuxtApp();
};
</script>

<style lang="scss" scoped>
.sidebar {
  // 모바일: 메인 컨텐츠 위로 오버레이
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  z-index: 5;

  height: calc(100vh - var(--header-height));
  overflow: hidden;
  overflow-y: auto;

  background: white;
  box-shadow: 0 0 4px 0
    color-mix(in srgb, var(--color-gray-09) 10%, transparent);

  transition: width 200ms ease-in-out;

  &[data-open="true"] {
    width: 80vw;
    border-right: solid 1px var(--color-gray-02);
  }

  // 모바일: 닫으면 폭 0
  &[data-open="false"] {
    width: 0;
    border-right: none;
  }

  // 태블릿, PC: 메인 컨텐츠를 밀어내면서 열림
  @include md {
    position: sticky;
    top: var(--header-height);
    bottom: auto;
    z-index: 0;

    flex-shrink: 0;
    border-right: solid 1px var(--color-gray-02);

    &[data-open="true"] {
      width: 240px;
    }
    &[data-open="false"] {
      width: 53px;
      border-right: solid 1px var(--color-gray-02);
    }
  }

  @include lg {
    &[data-open="false"] {
      width: 63px;
    }
  }

  &__content {
    height: 100%;
    padding: 12px;

    display: flex;
    flex-direction: column;
  }

  &__header {
    padding: 8px 12px;
    border-bottom: solid 1px var(--color-gray-02);

    @include md {
      display: none;
    }
  }

  &__footer {
    padding: 8px 12px;
    border-top: solid 1px var(--color-gray-02);

    margin-top: auto;

    .sidebar[data-open="false"] & {
      padding: 8px 0;
    }
  }
}
.menu {
  &__item {
    border: none;

    :deep(h3) {
      padding-inline: 12px;
      border-radius: 12px;

      &:hover {
        text-decoration: none;
      }

      transition: all 150ms ease-in-out;

      &[data-state="open"] {
        background-color: var(--color-primary-100);
        color: var(--color-primary-600);

        .lucide-chevron-down-icon {
          color: var(--color-primary-600);
        }
      }
    }

    .sidebar[data-open="true"] & {
      animation: var(--sidebar-menu-content-fade-in);
    }
    .sidebar[data-open="false"] & {
      animation: var(--sidebar-menu-content-fade-out);
    }
  }
  &__parent {
    display: block;
    width: 50%;
    padding-block: 16px;
    padding-inline: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    flex-shrink: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      text-decoration: underline;
    }
  }
  &__child {
    display: block;
    padding-block: 8px;

    &:hover {
      text-decoration: underline;
    }
  }
}
.admin {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__button {
    display: flex;
    gap: 8px;

    font-size: 12px;
    color: var(--color-text-gray-04);

    &__text {
      white-space: nowrap;
    }

    .sidebar[data-open="false"] & {
      margin-inline: auto;

      &__text {
        display: none;
      }
    }
  }
}
</style>
