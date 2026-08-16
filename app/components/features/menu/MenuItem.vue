<template>
  <VueDraggable
    v-model="list"
    group="menus"
    tag="ul"
    handle=".drag-handle"
    :disabled="disabled"
    class="flex flex-col gap-1"
    :class="
      depth > 0
        ? 'mt-1 ml-4 md:mt-2 md:ml-6 min-h-6 md:min-h-8'
        : 'min-h-6 md:min-h-8'
    "
    @start="handleDragStart"
    @end="handleDragEnd"
  >
    <li
      v-for="item in list"
      :key="item.id"
      class="rounded-sm md:rounded-md border bg-background select-none"
      :class="
        depth === 0
          ? 'p-1.5 pl-1 pt-1 md:p-3 md:pt-2'
          : 'p-1 pl-2 md:px-3 md:py-2'
      "
    >
      <div class="flex items-center gap-1 md:gap-2">
        <GripVertical
          class="shrink-0 text-text-gray-03"
          :class="[
            depth === 0 ? 'size-4' : 'size-3.5',
            disabled || isItemLocked(item.id)
              ? 'cursor-not-allowed opacity-50'
              : 'drag-handle cursor-grab active:cursor-grabbing',
          ]"
        />
        <span
          class="flex-1 truncate"
          :class="depth === 0 ? 'text-sm font-medium' : 'text-sm'"
        >
          {{ item.name }}
        </span>
        <div class="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            class="size-6 p-1 md:size-7 md:p-[5px] text-text-gray-03"
            :disabled="disabled || buttonDisabled"
            @click="handleUpdateHidden(item)"
          >
            <Eye v-if="!item.hidden" />
            <EyeOff v-else />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="size-6 p-[5px] md:size-7 md:p-1.5 text-text-gray-03"
            :disabled="disabled || buttonDisabled"
            @click="openEditModal?.(item.id)"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="size-6 md:size-7 p-1 md:p-[5px] text-red-03"
            :disabled="disabled || buttonDisabled"
            @click="handleDelete?.(item.id)"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <MenuItem
        v-if="depth < 1"
        v-model="item.children"
        :depth="depth + 1"
        :disabled="disabled"
        :button-disabled="buttonDisabled"
        :active-menu-id="activeMenuId"
      />
    </li>
  </VueDraggable>
</template>

<script setup lang="ts">
import type { MenuGroup } from "@/types/menu";
import { VueDraggable } from "vue-draggable-plus";
import { Eye, EyeOff, GripVertical, Pencil, Trash2 } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "vue-sonner";

defineOptions({
  name: "MenuItem",
});

const props = withDefaults(
  defineProps<{
    modelValue: MenuGroup[];
    depth?: number;
    disabled?: boolean;
    buttonDisabled?: boolean;
    // 현재 순서를 변경 중인 메뉴 id
    activeMenuId?: string | null;
  }>(),
  { depth: 0, disabled: false, buttonDisabled: false, activeMenuId: null }
);

const emit = defineEmits<{
  "update:modelValue": [MenuGroup[]];
}>();

const list = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 순서 변경 중에는 현재 변경 중인 메뉴만 드래그 가능하도록 나머지를 비활성화
const isItemLocked = (id: string) =>
  props.activeMenuId !== null && props.activeMenuId !== id;

// Injecting
const refreshMenus = inject<() => Promise<void>>("refreshMenus");
const openEditModal = inject<(id: string) => void>("openEditModal");

const onMenuDragStart = inject<(id: string) => void>("onMenuDragStart");
const onMenuDragEnd = inject<() => void>("onMenuDragEnd");

const handleDragStart = (evt: { oldIndex?: number }) => {
  const id =
    evt.oldIndex !== undefined ? list.value[evt.oldIndex]?.id : undefined;
  if (id) onMenuDragStart?.(id);
};

const handleDragEnd = () => {
  onMenuDragEnd?.();
};

const { updateHidden } = useUpdateHidden();
const handleUpdateHidden = async (data: MenuGroup) => {
  const { id, hidden } = data;
  try {
    await updateHidden({ id, hidden: !hidden });
    await refreshMenus?.();
    toast.success(
      `메뉴가 ${hidden ? "공개" : "비공개"} 상태로 변경되었습니다.`
    );
  } catch (error) {
    if (error instanceof PostgrestError) {
      toast.error(error.message);
    }
    toast.error("메뉴 공개 상태 변경에 실패했습니다.");
  }
};

const { deleteMenu } = useDeleteMenu();
const handleDelete = async (id: string) => {
  try {
    await deleteMenu(id);
    await refreshMenus?.();
    toast.success("메뉴가 삭제되었습니다.");
  } catch (error) {
    if (error instanceof PostgrestError) {
      toast.error(error.message);
    }
    toast.error("메뉴 삭제에 실패했습니다.");
  }
};
</script>
