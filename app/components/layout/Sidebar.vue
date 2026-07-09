<template>
  <aside class="sidebar" :data-open="props.open">
    <div class="sidebar__content">
      <div class="sidebar__footer">
        <NuxtLink
          v-if="!isAuthenticated"
          class="admin-login"
          to="/blog/admin/login"
        >
          <LockKeyhole class="size-5" />
          <span class="admin-login__text">관리자 로그인</span>
        </NuxtLink>
        <button v-else class="admin-login cursor-pointer" @click="signOut">
          <LogOut class="size-5" />
          <span class="admin-login__text">로그아웃</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LockKeyhole, LogOut } from "@lucide/vue";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const { isAuthenticated, signOut } = useAuth();
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

  &__footer {
    padding: 8px 12px;
    border-top: solid 1px var(--color-gray-02);

    margin-top: auto;

    .sidebar[data-open="false"] & {
      padding: 8px 0;
    }
  }
}
.admin-login {
  display: flex;
  align-items: center;
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
</style>
