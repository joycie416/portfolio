<template>
  <div class="admin-post-item">
    <div class="flex items-center justify-center">
      <Checkbox
        :model-value="props.checked"
        @update:model-value="emit('update:checked', props.post.id.toString())"
      />
    </div>
    <div class="flex-1 min-w-0">
      <NuxtLink
        class="admin-post-item__title"
        :to="`/blog/${props.post.menu_slug}/${props.post.id}`"
        prefetch-on="interaction"
      >
        {{ props.post.title }}
      </NuxtLink>
      <div class="admin-post-item__info">
        <p class="max-w-1/2 truncate">{{ props.post.menu_full_name }}</p>
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

<style lang="scss" scoped>
.admin-post-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);

  &:first-child {
    border-top: 1px solid var(--color-border);
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    font-size: 18px;

    &:hover {
      text-decoration: underline;
    }

    @include md {
      font-size: 20px;
      line-height: 28px;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--color-text-gray-03);

    @include md {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
