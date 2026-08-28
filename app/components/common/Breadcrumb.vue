<template>
  <div
    v-if="status === 'success'"
    data-slot="breadcrumb"
    :data-style="props.type === 'badge' ? 'badge' : 'default'"
    :class="cn('breadcrumb', props.class)"
  >
    <div v-if="truncatedItems.length >= 1" class="breadcrumb__overflow">
      <DropdownMenu>
        <DropdownMenuTrigger class="size-6 flex items-center justify-center">
          <Ellipsis class="size-5 text-text-gray-03" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="border-gray-02">
          <DropdownMenuItem v-for="item in truncatedItems" :key="item.label">
            <NuxtLink v-if="item.href" :to="item.href">
              {{ item.label }}
            </NuxtLink>
            <span v-else>
              {{ item.label }}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="breadcrumb__items">
      <div
        v-for="(item, index) in displayItems"
        :key="item.label"
        :class="[
          'breadcrumb__item',
          item.href ? 'breadcrumb__item__hover' : '',
        ]"
      >
        <ChevronRight
          v-if="(props.items.length > 2 && index === 0) || index > 0"
          class="size-4 md:size-5"
        />
        <NuxtLink v-if="item.href" :to="item.href" :title="item.label">
          {{ item.label }}
        </NuxtLink>
        <span v-else :title="item.label">
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
  <div
    v-else-if="status === 'loading'"
    data-slot="breadcrumb"
    :data-style="props.type === 'badge' ? 'badge' : 'default'"
    :class="cn('breadcrumb', props.class)"
  >
    <Skeleton class="h-4 w-15 md:h-5 md:w-20" />
    <ChevronRight class="size-4 md:size-5 text-text-gray-03" />
    <Skeleton class="h-4 w-15 md:h-5 md:w-20" />
  </div>
  <div
    v-else
    data-slot="breadcrumb"
    :data-style="props.type === 'badge' ? 'badge' : 'default'"
    :class="cn('breadcrumb text-text-primary-100', props.class)"
  >
    <TriangleAlert class="size-4" />
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, Ellipsis, TriangleAlert } from "@lucide/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Item {
  label: string;
  href?: string;
}
interface Props {
  items: Item[];
  status: "success" | "loading" | "error";
  type?: "default" | "badge";
  errorMessage?: string;
  class?: string;
}

const props = defineProps<Props>();

const truncatedItems = computed(() =>
  props.items.slice(0, props.items.length - 2)
);
const displayItems = computed(() => props.items.slice(-2));
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  width: fit-content;
  max-width: 100%;
  min-width: 0;

  .lucide {
    flex-shrink: 0;
    color: var(--color-text-gray-03);
  }

  &__overflow {
    flex-shrink: 0;
  }

  &__items {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.25rem;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
  }

  &__item {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.25rem;
    font-size: 14px;
    line-height: 1.3rem;
    min-width: 0;
    overflow: hidden;

    & a,
    & span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:not(:last-child) {
      flex: 0 1 auto;
    }

    @include md {
      font-size: 18px;
      line-height: 1.4;
    }

    color: var(--color-text-gray-04);

    &:last-child {
      flex: 0 0 auto;
      max-width: 100%;
      color: var(--color-primary-500);
    }

    &__hover {
      &:hover {
        color: var(--color-primary-300);

        &:last-child {
          color: var(--color-primary-500);
        }
      }
    }
  }

  &[data-style="badge"] {
    padding: 0.125rem 0.625rem;
    background-color: var(--color-primary-300);
    border-radius: 999px;
    color: var(--color-primary-100);

    .lucide {
      color: var(--color-primary-100);
    }
  }
  &[data-style="badge"] &__item {
    color: var(--color-primary-100);

    &:last-child {
      color: var(--color-primary-600);
    }

    &__hover {
      &:hover {
        color: var(--color-primary-200);

        &:last-child {
          color: var(--color-primary-700);
        }
      }
    }
  }
}
</style>
