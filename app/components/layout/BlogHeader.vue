<template>
  <header class="header">
    <button type="button" class="icon" @click="navigateTo('/blog')">
      <SimpleLogo class="size-5 md:size-7 lg:size-8" />
      Haein
    </button>
    <Button v-if="isAuthenticated" type="button" @click="handleSignOut"
      >로그아웃</Button
    >
    <Button v-else type="button" @click="navigateTo('/blog/admin/login')"
      >로그인</Button
    >
  </header>
</template>

<script setup lang="ts">
import SimpleLogo from "@/components/ui/logos/SimpleLogo.vue";
import { Button } from "@/components/ui/button";

const { isAuthenticated, signOut } = useAuth();

const handleSignOut = async () => {
  await signOut();
};
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
