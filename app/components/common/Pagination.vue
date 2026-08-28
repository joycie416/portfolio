<template>
  <PaginationRoot
    :page="page"
    :total="total"
    :items-per-page="itemsPerPage"
    :class="props.class"
    @update:page="handlePageChange"
  >
    <PaginationContent>
      <Button
        variant="ghost"
        size="icon"
        data-slot="pagination-first"
        class="size-5 md:size-6"
        :disabled="page === 1"
        @click="() => emit('update:page', 1)"
      >
        <ChevronsLeft />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        data-slot="pagination-previous"
        class="size-5 md:size-6"
        :disabled="page === 1"
        @click="() => emit('update:page', page - 1)"
      >
        <ChevronLeft />
      </Button>
      <PaginationItem
        v-for="p in pageList"
        :key="p"
        :value="p"
        class="size-5 md:size-6"
        :class="[
          page === p && 'text-primary hover:bg-transparent cursor-default',
          page !== p && 'text-text-gray-02',
        ]"
      />
      <Button
        variant="ghost"
        size="icon"
        data-slot="pagination-next"
        class="size-5 md:size-6"
        :disabled="page === totalPage"
        @click="() => emit('update:page', page + 1)"
      >
        <ChevronRight />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        data-slot="pagination-last"
        class="size-5 md:size-6"
        :disabled="page === totalPage"
        @click="() => emit('update:page', totalPage)"
      >
        <ChevronsRight />
      </Button>
    </PaginationContent>
  </PaginationRoot>
</template>

<script setup lang="ts">
import {
  PaginationContent,
  PaginationItem,
  Pagination as PaginationRoot,
} from "@/components/ui/pagination";
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "@lucide/vue";

const props = defineProps<{
  page: number;
  total: number;
  itemsPerPage: number;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits<{
  "update:page": [page: number];
}>();

const totalPage = computed(() =>
  Math.max(1, Math.ceil(props.total / (props.itemsPerPage || 1)))
);

// reka PaginationRoot/Item 내부 클릭으로 올라온 이벤트를 부모로 전달 (동일 페이지는 무시)
const handlePageChange = (next: number) => {
  if (next !== props.page) emit("update:page", next);
};

const WINDOW = 5;

const pageList = computed(() => {
  const max = totalPage.value;
  if (max <= WINDOW) {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  const start = Math.min(Math.max(props.page - 3, 1), max - WINDOW + 1);
  return Array.from({ length: WINDOW }, (_, i) => start + i);
});
</script>
