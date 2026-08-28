<template>
  <header class="header">
    <div class="sidebar__top" :data-open="props.isSidebarOpen">
      <Button variant="ghost" class="logo__button" @click="navigateTo('/blog')">
        <SimpleLogo class="size-5 md:size-7 lg:size-8" />
        Haein
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="size-9 md:size-10 ml-auto text-text-gray-02"
        @click="emit('toggleSidebar')"
      >
        <PanelLeft />
      </Button>
    </div>
    <NuxtLink class="text font-rix max-md:hidden" to="/portfolio">
      Portfolio
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { SimpleLogo } from "@/components/logos";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "@lucide/vue";

interface Props {
  isSidebarOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggleSidebar: [];
}>();
</script>

<style lang="scss" scoped>
.logo__button {
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;
  gap: 8px;

  font-family: var(--font-rix);
  color: var(--color-primary-800);
  font-size: 16px;
  line-height: 24px;

  @include md {
    font-size: 20px;
    line-height: 28px;
  }
  @include lg {
    font-size: 24px;
    line-height: 32px;
  }
}

.header {
  position: fixed;
  top: 0;

  width: 100%;
  height: var(--header-height);

  padding-right: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: var(--color-white);
  border-bottom: solid 1px var(--color-gray-02);

  z-index: 10;
}

.text {
  font-family: var(--font-rix);
  font-size: 12px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: var(--color-primary-400);
  }

  @include md {
    font-size: 14px;
  }
  @include lg {
    font-size: 16px;
  }
}

.sidebar {
  &__top {
    height: 100%;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-right: solid 1px var(--color-gray-02);
    box-shadow: 0 0 4px 0
      color-mix(in srgb, var(--color-gray-09) 10%, transparent);

    transition: all 200ms ease-in-out;

    @include md {
      padding: 0 6px;
    }
    @include lg {
      padding: 0 10px;
    }

    &[data-open="true"] {
      width: 80vw;

      @include md {
        width: 240px;
      }
    }

    &[data-open="false"] {
      width: 45px;

      @include md {
        width: 53px;
      }
      @include lg {
        width: 63px;
      }
    }
  }

  &__top[data-open="true"] .logo__button {
    animation: var(--animate-sidebar-content-fade-in);
  }
  &__top[data-open="false"] .logo__button {
    animation: var(--animate-sidebar-content-fade-out);
  }
}
</style>
