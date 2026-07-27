<template>
  <div class="px-2 py-3 flex items-center gap-3 border-b first:border-t">
    <div class="flex items-center justify-center">
      <Checkbox
        :model-value="props.checked"
        @update:model-value="emit('update:checked', props.post.id.toString())"
      />
    </div>
    <div class="flex-1">
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
    <Button
      v-if="props.showDeleteButton"
      variant="ghost"
      size="icon"
      class="size-6 md:size-7 p-1 md:p-[5px] text-text-gray-04"
      @click="handleDelete"
    >
      <Trash2 />
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { TransformedPost } from "@/types/supabase";
import { Checkbox } from "@/components/common";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { Trash2 } from "@lucide/vue";
import { toast } from "vue-sonner";

interface Props {
  post: TransformedPost;
  checked: boolean;
  showDeleteButton: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:checked": [id: string];
}>();

const { deletePost } = useDeletePost();
const handleDelete = async () => {
  try {
    await deletePost(props.post.id);
    toast.success("게시글이 삭제되었습니다.");
  } catch {
    toast.error("게시글 삭제에 실패했습니다.");
  }
};
</script>
