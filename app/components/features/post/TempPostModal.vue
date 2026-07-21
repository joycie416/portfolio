<template>
  <Dialog
    :open="open"
    title="임시 저장 목록"
    class="min-h-80 max-h-[50vh] flex flex-col"
  >
    <div class="flex-1 min-h-0 overflow-y-auto">
      <DataTable
        table-id="temp-post-table"
        :columns="columns"
        :data="data"
        :class-names="{
          tableContainer: 'rounded-t-[4px] overflow-hidden',
          tableHeader: 'bg-gray-02',
          emptyRow: 'h-[138px]',
        }"
      />
    </div>
    <template #footer>
      <Button variant="outline" @click="close">닫기</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { Columns } from "@/components/ui/data-table";
import type { TempPost } from "@/types/supabase";
import { Trash2 } from "@lucide/vue";

const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};

const data = ref<TempPost[]>([
  {
    id: 123,
    menu_id: "123",
    title: "임시 제목입니다.asddddddddddddddddddddddddddddddddddddddddddddd",
    content: "내용",
    created_at: "2026-01-01",
    modified_at: "2026-01-01",
    hidden: false,
    tags: ["tag1", "tag2"],
    thumbnail: "https://example.com/thumbnail.jpg",
  },
]);

const handleDelete = async (id: number) => {};

const columns = computed<Columns<TempPost>>(() => [
  {
    accessorKey: "created_at",
    header: "작성일",
    cell: ({ row }) => formatDate(row.original.created_at, "YYYY.MM.DD"),
    meta: {
      classNames: { header: "w-3/10", cell: "truncate" },
      aligns: {
        header: "center",
        cell: "center",
      },
    },
  },
  {
    accessorKey: "title",
    header: () =>
      h("span", {
        class: "text-sm text-text-gray-01",
        innerHTML: "제목",
      }),
    cell: ({ row }) => row.original.title,
    meta: {
      classNames: { header: "w-full", cell: "truncate" },
    },
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) =>
      h(
        Button,
        {
          variant: "ghost",
          size: "icon",
          class: "size-full min-w-4 text-red-04",
          onClick: () => handleDelete(row.original.id),
        },
        () => h(Trash2, { class: "size-4 shrink-0" })
      ),
    meta: {
      classNames: {
        header: "w-1/10",
        cell: "flex items-center justify-center",
      },
    },
  },
]);
</script>
