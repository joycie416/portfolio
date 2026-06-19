<template>
  <VueDraggable
    v-model="list"
    group="menus"
    tag="ul"
    handle=".drag-handle"
    class="flex flex-col gap-1"
    :class="depth > 0 ? 'mt-2 ml-6 min-h-8' : 'min-h-8'"
  >
    <li
      v-for="item in list"
      :key="item.id"
      class="rounded-md border bg-background select-none"
      :class="depth === 0 ? 'p-3' : 'px-3 py-2'"
    >
      <div class="flex items-center gap-2">
        <GripVertical
          class="drag-handle shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
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
            class="size-7 p-[5px] text-text-gray-03"
          >
            <Eye v-if="!item.hidden" />
            <EyeOff v-else />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="size-7 p-[5px] text-red-03"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <MenuItem v-if="depth < 1" v-model="item.children" :depth="depth + 1" />
    </li>
  </VueDraggable>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { Eye, GripVertical, Trash2 } from "@lucide/vue";
import type { MenuGroup } from "@/types/common";
import { Button } from "~/components/ui/button";

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
}>();

const list = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>
