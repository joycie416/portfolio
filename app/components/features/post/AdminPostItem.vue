<template>
  <div class="pl-2 py-3 flex items-center gap-3 border-b first:border-t">
    <div class="flex items-center justify-center">
      <Checkbox
        :model-value="props.checked"
        @update:model-value="emit('update:checked', props.post.id.toString())"
      />
    </div>
    <div>
      <p class="text-[18px] md:text-xl">
        {{ props.post.title }}
      </p>
      <div
        class="flex items-center gap-x-2 flex-wrap text-xs md:text-sm text-text-gray-03 [&_p]:whitespace-nowrap"
      >
        <p>{{ props.post.menu_full_name }}</p>
        <div class="w-px h-3 bg-text-gray-03" />
        <p>{{ formatDate(props.post.created_at) }}</p>
        <div class="w-px h-3 bg-text-gray-03" />
        <p>{{ props.post.hidden ? "비공개" : "공개" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TransformedPost } from "@/types/supabase";
import { Checkbox } from "@/components/common";
import { formatDate } from "@/utils/format-date";

interface Props {
  post: TransformedPost;
  checked: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:checked": [id: string];
}>();
</script>
