<template>
  <div class="flex flex-col gap-2 md:gap-4 py-5 px-4 border-b last:border-b-0">
    <div class="flex flex-col justify-between gap-2">
      <Skeleton class="w-1/2 h-5.5 rounded-full" />
      <div class="flex items-center gap-2">
        <Skeleton class="size-6 md:size-8 rounded-full" />
        <Skeleton class="h-4 w-20 md:h-5 md:w-24 rounded-sm" />
        <hr class="w-px h-3.5 bg-gray-03 md:h-4" />
        <Skeleton class="h-4 w-20 md:h-5 md:w-24 rounded-sm" />
      </div>
    </div>
    <div class="relative w-full min-h-10 md:min-h-16 px-1 space-y-2">
      <Skeleton class="w-full h-3.5 md:h-4 rounded-sm" />
      <Skeleton class="w-2/3 h-3.5 md:h-4 rounded-sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
</script>
