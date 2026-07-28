<template>
  <div v-if="status === 'success'" class="flex items-center gap-1">
    <DropdownMenu v-if="truncatedItems.length >= 1">
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
    <div class="flex gap-1">
      <div
        v-for="(item, index) in displayItems"
        :key="item.label"
        class="flex items-center gap-1 text-base md:text-lg text-text-gray-04 last:text-primary-500"
        :class="
          item.href ? 'hover:text-primary-300 last:hover:text-primary-500' : ''
        "
      >
        <ChevronRight
          v-if="(props.items.length > 2 && index === 0) || index > 0"
          class="size-4 md:size-5 text-text-gray-03"
        />
        <NuxtLink v-if="item.href" :to="item.href">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="">
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
  <div v-else-if="status === 'loading'" class="flex items-center gap-1">
    <Skeleton class="h-4 w-15 md:h-5 md:w-20" />
    <ChevronRight class="size-4 md:size-5 text-text-gray-03" />
    <Skeleton class="h-4 w-15 md:h-5 md:w-20" />
  </div>
  <div v-else class="flex items-center gap-1 text-text-gray-04 text-sm">
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
import { Skeleton } from "../ui/skeleton";

interface Item {
  label: string;
  href?: string;
}
interface Props {
  items: Item[];
  status: "success" | "loading" | "error";
  errorMessage?: string;
}

const props = defineProps<Props>();

const truncatedItems = computed(() =>
  props.items.slice(0, props.items.length - 2)
);
const displayItems = computed(() => props.items.slice(-2));
</script>
