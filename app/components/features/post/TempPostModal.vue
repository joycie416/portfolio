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
        :data="data.data"
        :status="tableStatus"
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
import type { SimpleTempPost } from "@/types/supabase";
import { Trash2 } from "@lucide/vue";
import { toast } from "vue-sonner";
import { useGetTempPosts } from "~/composables/usePost";

const route = useRoute();
const router = useRouter();

const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};

const { data, status, refresh } = useGetTempPosts();

const deleteStatus = ref<"loading" | "success">("success");

const tableStatus = computed(() => {
  if (status.value === "pending" || deleteStatus.value === "loading")
    return "loading";
  if (status.value === "error") return "error";
  return "success";
});

const { deletePost } = useDeletePost();
const handleDelete = async (id: number) => {
  try {
    deleteStatus.value = "loading";
    await deletePost(id, true);
    await refresh();
    // 현재 수정 중인 임시저장 게시글을 삭제한 경우 query도 제거
    if (route.query.temp === id.toString()) {
      router.replace({ query: { temp: undefined } });
    }
  } catch {
    toast.error("임시저장 삭제에 실패했습니다.");
  } finally {
    deleteStatus.value = "success";
  }
};

const columns = computed<Columns<SimpleTempPost>>(() => [
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
