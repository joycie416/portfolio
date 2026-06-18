<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="status === 'success'"
      v-for="menu in transformedMenus"
      :key="menu.id"
    >
      <p>{{ menu.name }}</p>
      <div v-if="menu.children" class="pl-4 space-y-2">
        <div v-for="child in menu.children" :key="child.id">
          <p>{{ child.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: menus, status } = useGetAllMenus();
const transformedMenus = computed(() =>
  menus.value ? menusTransformer(menus.value) : []
);
</script>
