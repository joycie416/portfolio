<template>
  <div>
    <p>{{ user?.email ?? "로그인 필요" }}</p>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>
