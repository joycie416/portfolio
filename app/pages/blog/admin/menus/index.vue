<template>
  <div>
    {{ menus }}
    <br />
    {{ status }}
  </div>
</template>

<script setup lang="ts">
const { data: menus, status } = useGetAllMenus();
</script>
