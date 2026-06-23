<template>
  <VueDraggable
    v-model="list"
    group="menus"
    tag="ul"
    handle=".drag-handle"
    class="flex flex-col gap-1"
    :class="
      depth > 0
        ? 'mt-1 ml-4 md:mt-2 md:ml-6 min-h-6 md:min-h-8'
        : 'min-h-6 md:min-h-8'
    "
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
          class="drag-handle shrink-0 cursor-grab text-text-gray-03 active:cursor-grabbing"
          :class="depth === 0 ? 'size-4' : 'size-3.5'"
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
            @click="handleUpdateHidden(item)"
          >
            <Eye v-if="!item.hidden" />
            <EyeOff v-else />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="size-6 p-[5px] md:size-7 md:p-1.5 text-text-gray-03"
            @click="onEditClick(item.id)"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="size-6 md:size-7 p-1 md:p-[5px] text-red-03"
            @click="onDeleteClick(item.id)"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <MenuItem
        v-if="depth < 1"
        v-model="item.children"
        :depth="depth + 1"
        @edit-click="onEditClick"
        @delete-click="onDeleteClick"
      />
    </li>
  </VueDraggable>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { Eye, EyeOff, GripVertical, Pencil, Trash2 } from "@lucide/vue";
import type { MenuGroup } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { PostgrestError } from "@supabase/supabase-js";

defineOptions({
  name: "MenuItem",
});

const props = withDefaults(
  defineProps<{
    modelValue: MenuGroup[];
    depth?: number;
  }>(),
  { depth: 0 }
);

const emits = defineEmits<{
  "update:modelValue": [MenuGroup[]];
  editClick: [menuId: string];
  deleteClick: [menuId: string];
}>();

const onEditClick = (menuId: string) => emits("editClick", menuId);
const onDeleteClick = (menuId: string) => emits("deleteClick", menuId);

const list = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const refreshMenus = inject<() => Promise<void>>("refreshMenus");

const { updateHidden } = useUpdateHidden();
const handleUpdateHidden = async (data: MenuGroup) => {
  const { id, hidden } = data;
  try {
    await updateHidden({ id, hidden: !hidden });
    await refreshMenus?.();
  } catch (error) {
    if (error instanceof PostgrestError) {
      alert(error.message);
    }
  }
};
</script>
