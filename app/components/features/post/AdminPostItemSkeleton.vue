<template>
  <div class="px-2 py-3 flex items-center gap-3 border-b first:border-t">
    <div class="flex items-center justify-center">
      <Checkbox disabled />
    </div>
    <div class="flex-1 min-w-0 space-y-2">
      <Skeleton class="w-1/4 h-5" />
      <div class="flex items-center gap-x-2 flex-wrap">
        <Skeleton class="w-1/4 h-4 rounded-sm" />
        <div class="w-px h-3 bg-text-gray-03" />
        <Skeleton class="w-1/4 h-4 rounded-sm" />
        <div class="w-px h-3 bg-text-gray-03" />
        <Skeleton class="w-1/4 h-4 rounded-sm" />
      </div>
    </div>
    <Skeleton class="size-6 md:size-7" />
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";
</script>
