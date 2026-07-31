<template>
  <Card class="p-0 md:p-0 post-item" @click="handleClick">
    <div class="post-item__thumbnail">
      <NuxtImg
        v-if="post.thumbnail"
        :src="post.thumbnail"
        :alt="post.title"
        class="size-full object-cover"
      />
      <div v-else class="size-full flex justify-center items-center bg-gray-02">
        <LogoIcon class="size-15" fill="#fff" />
      </div>
    </div>
    <div class="post-item__content">
      <h3
        class="md:h-14 text-base md:text-lg font-bold max-md:truncate md:line-clamp-2"
      >
        {{ post.title }}
      </h3>
      <p class="text-xs md:text-sm text-gray-500 line-clamp-4">
        {{ post.excerpt }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Post } from "@/types/supabase";
import { Card } from "@/components/common";
import { LogoIcon } from "@/components/icons";

const props = defineProps<{ post: Post }>();
const post = computed(() => props.post);

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const handleClick = () => {
  navigateTo(`/blog/${slug.value}/${post.value.id}`);
};
</script>

<style lang="scss" scoped>
@layer components {
  .post-item {
    display: flex;
    height: 120px;
    overflow: hidden;

    transition:
      transform 0.2s ease-in-out,
      scale 0.2s ease-in-out;
    cursor: pointer;

    @include md {
      flex-direction: column;
      height: 360px;
    }

    &:hover {
      scale: 1.03;
      @include md {
        transform: translateY(-5px);
      }
    }

    &__thumbnail {
      flex: 0 0 30%;
      width: 100%;
      min-height: 0;

      @include md {
        flex: 0 0 50%;
        width: 100%;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      width: 100%;
      height: 100%;
      padding: 12px 16px;
      overflow: hidden;

      @include md {
        padding: 16px;
        gap: 8px;
      }
    }
  }
}
</style>
