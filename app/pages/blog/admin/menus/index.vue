<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end gap-2">
      <Button @click="() => openCreate()">메뉴 추가</Button>
    </div>
    <div class="flex flex-col gap-1">
      <ClientOnly>
        <template v-if="status === 'success'">
          <div
            v-if="fixedMenu"
            class="rounded-sm md:rounded-md border bg-gray-01 p-1.5 md:px-3 md:py-2 flex items-center gap-1 md:gap-2"
          >
            <Pin class="size-3.5 md:size-4 shrink-0 text-text-gray-03" />
            <span class="text-sm font-medium">{{ fixedMenu.name }}</span>
          </div>

          <MenuItem
            v-model="draggableMenus"
            @edit-click="handleEditClick"
            @delete-click="handleDeleteMenu"
          />
        </template>
        <template #fallback>
          <p class="text-sm text-muted-foreground">로딩중...</p>
        </template>
      </ClientOnly>
    </div>
  </div>
  <EditMenuModal
    v-if="menuState !== null"
    :menu="menuState.menu"
    @on-close="closeEditModal"
    @on-create="handleCreateMenu"
    @on-edit="handleEditMenu"
  />
</template>

<script setup lang="ts">
import MenuItem from "@/components/features/menu/MenuItem.vue";
import { Button } from "@/components/ui/button";
import { Pin } from "@lucide/vue";
import type { MenuGroup, MenuState } from "@/types/menu";
import type { MenuInsertType, MenuUpdateType } from "@/types/supabase";
import EditMenuModal from "@/components/features/menu/EditMenuModal.vue";
import { PostgrestError } from "@supabase/supabase-js";

// 메뉴 목록 조회
const { data: menus, status, refresh } = useGetAllMenus();
provide("refreshMenus", refresh);

const transformedMenus = computed(() =>
  menus.value ? menusTransformer(menus.value) : []
);

const localMenus = ref<MenuGroup[]>([]);

watch(
  transformedMenus,
  (val) => {
    localMenus.value = val;
  },
  { immediate: true }
);

const fixedMenu = computed(() => localMenus.value[0]);

const draggableMenus = computed({
  get: () => localMenus.value.slice(1),
  set: (val) => {
    localMenus.value = localMenus.value[0]
      ? [localMenus.value[0], ...val]
      : val;
  },
});

// 메뉴 추가/수정 시 상태
const menuState = ref<MenuState>(null);

const openCreate = () => {
  console.log("openCreate");
  menuState.value = { menu: null };
};

const closeEditModal = () => {
  menuState.value = null;
};

const handleEditClick = (id: string) => {
  const menuToEdit = menus.value?.find((menu) => menu.id === id);
  if (!menuToEdit) return;
  menuState.value = { menu: menuToEdit };
};

const { createMenu } = useCreateMenu();
const handleCreateMenu = async (data: MenuInsertType) => {
  try {
    const orderIdx = transformedMenus.value.length + 1;
    await createMenu({ ...data, order_idx: orderIdx });
    await refresh();
    closeEditModal();
  } catch (error) {
    if (error instanceof PostgrestError) {
      alert(error.message);
    }
  }
};

const { updateMenu } = useUpdateMenu();
const handleEditMenu = async (data: MenuUpdateType) => {
  try {
    await updateMenu(data);
    await refresh();
    closeEditModal();
  } catch (error) {
    if (error instanceof PostgrestError) {
      alert(error.message);
    }
  }
};

const { deleteMenu } = useDeleteMenu();
const handleDeleteMenu = async (id: string) => {
  try {
    await deleteMenu(id);
    await refresh();
  } catch (error) {
    if (error instanceof PostgrestError) {
      alert(error.message);
    }
  }
};
</script>
