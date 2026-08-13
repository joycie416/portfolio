<template>
  <div :class="cn('search__container', props.class)" :data-theme="props.theme">
    <input
      type="text"
      placeholder="What are you looking for?"
      v-model="query"
      class="search__input"
      @keyup.enter="handleSearch"
    />
    <button class="search__button" @click="handleSearch">
      <span class="max-md:hidden">Search</span>
      <Search class="md:hidden" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@lucide/vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  theme: "light" | "dark";
  class?: HTMLAttributes["class"];
}>();

const query = ref("");

const handleSearch = () => {
  if (query.value.trim()) {
    navigateTo(`/blog/search?query=${query.value.trim()}`);
  }

  if (!query.value.trim()) {
    query.value = "";
  }
};
</script>

<style lang="scss" scoped>
.search__container[data-theme="light"] {
  --background-color: white;
  --text-color: black;
}

.search__container[data-theme="dark"] {
  --background-color: black;
  --text-color: white;
}
.search__container {
  width: 100%;
  height: 32px;
  background: color-mix(in srgb, var(--background-color) 65%, transparent);
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  outline: 5px solid
    color-mix(in srgb, var(--background-color) 40%, transparent);

  @include md {
    width: 60%;
    height: 36px;
  }

  @include lg {
    width: 40%;
  }
}

.search__input {
  flex: 1;
  height: 100%;
  padding: 0 20px;
  color: var(--text-color);
  font-size: 14px;
  line-height: calc(1.25 / 0.875) ≈ 1.428571;

  @include md {
    font-size: 16px;
    line-height: 1.5;
  }

  &::placeholder {
    color: color-mix(in srgb, var(--text-color) 40%, transparent);
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }
}

.search__button {
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-500);
  color: var(--color-primary-45);
  cursor: pointer;

  @include md {
    width: 25%;
  }

  @include lg {
    width: 20%;
  }

  &:hover {
    background: var(--color-primary-400);
  }
}
</style>
