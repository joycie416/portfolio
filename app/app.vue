<script setup lang="ts">
import { Header } from "./components/layout";
</script>

<template>
  <div class="app">
    <Header />
    <NuxtPage />
  </div>
</template>

<style>
.app {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background-color: var(--color-primary-45);
  color: var(--color-text-gray-01);
}
</style>
