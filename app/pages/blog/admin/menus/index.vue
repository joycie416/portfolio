<template>
  <div class="flex flex-col gap-1">
    <ClientOnly>
      <template v-if="status === 'success'">
        <div
          v-if="fixedMenu"
          class="rounded-sm md:rounded-md border bg-gray-01 px-1.5 py-1.5 md:px-3 md:py-2 flex items-center gap-1 md:gap-2"
        >
          <Pin class="size-3.5 md:size-4 shrink-0 text-text-gray-03" />
          <span class="text-sm font-medium">{{ fixedMenu.name }}</span>
        </div>

        <MenuItem v-model="draggableMenus" />
      </template>
      <template #fallback>
        <p class="text-sm text-muted-foreground">로딩중...</p>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import MenuItem from "@/components/features/menu/MenuItem.vue";
import { Pin } from "@lucide/vue";
import type { MenuGroup } from "@/types/common";

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
</script>
