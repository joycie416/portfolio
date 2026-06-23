<template>
  <div class="flex flex-col gap-2">
    <Button
      @click="menuState.mode === 'drag' ? openCreate() : closeEdit()"
      class="w-fit self-end"
    >
      {{ buttonText }}
    </Button>
    <template v-if="menuState.mode === 'drag'">
      <MenuDragTab :on-edit="openEdit" />
    </template>
    <template v-else>
      <MenuEditTab :menu="editMenu" />
    </template>
  </div>
</template>

<script setup lang="ts">
import MenuDragTab from "@/components/features/menu/MenuDragView.vue";
import MenuEditTab from "@/components/features/menu/MenuEditView.vue";
import { Button } from "@/components/ui/button";
import type { Menu } from "@/types/supabase";
import type { MenuState } from "@/types/menu";

const menuState = ref<MenuState>({ mode: "drag" });

const buttonText = computed(() =>
  menuState.value.mode === "drag" ? "메뉴 추가" : "취소"
);

const editMenu = computed<Menu | null>(() =>
  menuState.value.mode === "edit" ? menuState.value.menu : null
);

const openCreate = () => {
  menuState.value = { mode: "edit", menu: null };
};

const openEdit = (menu: Menu) => {
  menuState.value = { mode: "edit", menu };
};

const closeEdit = () => {
  menuState.value = { mode: "drag" };
};
</script>
