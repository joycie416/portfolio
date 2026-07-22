<template>
  <div class="flex items-center gap-1 flex-wrap justify-end">
    <!-- 메뉴 이동 -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" :disabled="isDisabled" class="group">
          메뉴 이동
          <ChevronDown
            class="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="max-h-45 overflow-y-auto">
        <DropdownMenuItem
          v-for="option in menuMoveOptions"
          :key="option.value"
          @select="handleMoveMenu(option.value)"
        >
          {{ option.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- 공개 여부 변경 -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="sm" :disabled="isDisabled" class="group">
          공개 여부
          <ChevronDown
            class="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @select="handleUpdateHidden(false)">
          <Eye class="size-4" />
          공개
        </DropdownMenuItem>
        <DropdownMenuItem @select="handleUpdateHidden(true)">
          <EyeOff class="size-4" />
          비공개
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- 삭제 -->
    <Button
      variant="ghost"
      size="sm"
      class="text-red-04"
      :disabled="isDisabled"
      @click="confirmOpen = true"
    >
      삭제
    </Button>

    <ConfirmDialog
      title="게시글 삭제"
      :open="confirmOpen"
      confirm-text="삭제"
      confirm-variant="destructive"
      :loading="loading"
      @confirm="handleDelete"
      @cancel="confirmOpen = false"
    >
      선택한 {{ props.selectedIds.length }}개의 게시글을 삭제할까요?
      <br />
      삭제한 게시글은 복구할 수 없습니다.
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ConfirmDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Eye, EyeOff } from "@lucide/vue";
import { PostgrestError } from "@supabase/supabase-js";
import { toMenuOptions } from "@/utils/menu";
import { useBulkPostActions } from "@/composables/usePost";
import type { PostBulkFailure } from "@/types/supabase";
import { toast } from "vue-sonner";

const props = defineProps<{
  selectedIds: number[];
}>();

const emit = defineEmits<{
  done: [];
}>();

const { data: menus } = useGetAllMenus();

// 메뉴 필터의 menuOptions와 동일한 값을 사용하되, 이동 대상으로 무효한 "전체"는 제외
const menuMoveOptions = computed(() =>
  toMenuOptions(menus.value ?? []).filter((option) => option.value !== "all")
);

const { bulkDelete, bulkUpdateHidden, bulkMoveMenu } = useBulkPostActions();

const loading = ref(false);
const confirmOpen = ref(false);

const isDisabled = computed(
  () => loading.value || props.selectedIds.length === 0
);

const modeName = {
  delete: "삭제",
  move: "이동",
  hidden: "변경",
};

/**
 * bulk 액션 공통 실행 래퍼.
 * RPC는 실패(못 찾은)한 행만 반환하므로, 있으면 안내 후에도 목록은 갱신한다.
 */
const runAction = async (
  action: (ids: number[]) => Promise<PostBulkFailure[]>,
  mode: keyof typeof modeName
) => {
  if (props.selectedIds.length === 0 || loading.value) return;

  loading.value = true;
  try {
    const failures = await action([...props.selectedIds]);
    if (failures.length > 0) {
      toast.error(
        `${props.selectedIds.length}개 중 ${failures.length}개 게시글 ${modeName[mode]}에 실패했습니다.`
      );
    } else {
      toast.success(
        `${props.selectedIds.length}개 게시글 ${modeName[mode]}에 성공했습니다.`
      );
    }
    emit("done");
  } catch (error) {
    if (error instanceof PostgrestError) {
      toast.error(error.message);
    } else {
      toast.error(
        `${props.selectedIds.length}개 게시글 ${modeName[mode]}에 실패했습니다.`
      );
    }
  } finally {
    loading.value = false;
  }
};

const handleMoveMenu = (menuId: string) =>
  runAction((ids) => bulkMoveMenu(ids, menuId), "move");

const handleUpdateHidden = (hidden: boolean) =>
  runAction((ids) => bulkUpdateHidden(ids, hidden), "hidden");

const handleDelete = async () => {
  await runAction(bulkDelete, "delete");
  confirmOpen.value = false;
};
</script>
