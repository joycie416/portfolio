<template>
  <Card class="p-0 md:p-0 post-item">
    <div class="post-item__thumbnail">
      <Skeleton class="size-full rounded-none" />
    </div>
    <div class="post-item__content">
      <Skeleton class="w-full h-7" />
      <div class="space-y-1">
        <Skeleton class="w-full h-4 rounded-sm" />
        <Skeleton class="w-full h-4 rounded-sm" />
        <Skeleton class="w-3/4 h-4 rounded-sm" />
        <Skeleton class="max-md:hidden w-1/2 h-4 rounded-sm" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from "@/components/common";
import { Skeleton } from "~/components/ui/skeleton";
</script>

<style lang="scss" scoped>
@layer components {
  .post-item {
    display: flex;
    height: 120px;
    overflow: hidden;

    @include md {
      flex-direction: column;
      height: 360px;
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
      gap: 12px;

      width: 100%;
      height: 100%;
      padding: 12px 16px;
      overflow: hidden;

      @include md {
        padding: 16px;
        gap: 20px;
      }
    }
  }
}
</style>
