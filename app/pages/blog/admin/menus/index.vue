<template>
  <div class="flex flex-col gap-1">
    <ClientOnly>
      <template v-if="status === 'success'">
        <div
          v-if="fixedMenu"
          class="rounded-md border bg-muted/40 px-3 py-2 flex items-center gap-2"
        >
          <Lock class="size-4 shrink-0 text-muted-foreground/50" />
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
import { Lock } from "@lucide/vue";
import type { MenuGroup } from "@/types/common";

const { data: menus, status } = useGetAllMenus();
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
