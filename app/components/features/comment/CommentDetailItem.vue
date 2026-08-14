<template>
  <div class="flex flex-col gap-2 md:gap-4 py-5 px-4 border-b last:border-b-0">
    <div class="flex flex-col justify-between gap-2">
      <div class="comment-detail__post-title" @click="moveToPost">
        <p class="truncate">{{ comment.post_title }}</p>
        <MoveUpRight class="size-3.5" />
      </div>
      <div class="flex items-center gap-2">
        <div class="avatar" :style="{ '--avatar-color': avatarColor }">
          <avatar-icon class="size-full" />
        </div>
        <p class="font-semibold text-sm md:text-base">{{ comment.nickname }}</p>
        <hr class="w-px h-3.5 bg-gray-03 md:h-4" />
        <p class="text-text-gray-03 text-sm md:text-base">
          {{ formatDate(comment.created_at) }}
        </p>
        <hr v-if="deleteable" class="w-px h-3.5 bg-gray-03 md:h-4" />
        <Button
          v-if="deleteable"
          variant="ghost"
          size="icon"
          class="size-5 md:size-6 p-0.5 text-red"
          @click="openDeleteConfirm"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
    <div class="relative w-full min-h-10 md:min-h-16 px-1">
      <p
        class="whitespace-pre-wrap line-clamp-2 md:line-clamp-3 text-sm md:text-base"
      >
        {{ comment.content }}
      </p>
    </div>
  </div>
  <ConfirmDialog
    v-if="deleteable"
    title="댓글 삭제"
    :open="deleteConfirmOpen"
    confirm-text="삭제"
    confirm-variant="destructive"
    :loading="loading"
    @confirm="handleDelete"
    @cancel="deleteConfirmOpen = false"
  >
    댓글을 삭제할까요?
    <br />
    삭제한 댓글은 복구할 수 없습니다.
  </ConfirmDialog>
</template>

<script setup lang="ts">
import type { CommentWithSlug } from "@/types/supabase";
import { Laugh, MoveUpRight, Smile, Trash2, UserRound } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { ConfirmDialog } from "@/components/common";

const props = defineProps<{ comment: CommentWithSlug; deleteable?: boolean }>();

const emit = defineEmits<{
  "refresh-comments": [];
}>();

const COLORS = [
  "var(--color-highlight-blue)",
  "var(--color-highlight-red)",
  "var(--color-highlight-yellow)",
  "var(--color-highlight-gray)",
];
const ICONS = [UserRound, Smile, Laugh];

const avatarColor = COLORS[props.comment.id % 4];
const avatarIcon = ICONS[props.comment.id % 3];

const moveToPost = () => {
  navigateTo(`/blog/${props.comment.menu_slug}/${props.comment.post_id}`);
};

const { deleteComment } = useDeleteComment();
const deleteConfirmOpen = ref(false);
const loading = ref(false);

const openDeleteConfirm = () => {
  deleteConfirmOpen.value = true;
};

const handleDelete = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    await deleteComment(props.comment.id);
    emit("refresh-comments");
    deleteConfirmOpen.value = false;
    toast.success("댓글이 삭제되었습니다.");
  } catch {
    toast.error("댓글 삭제에 실패했습니다.");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.comment-detail {
  &__post-title {
    width: fit-content;
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;

    background-color: var(--color-gray-02);
    padding: 2px 8px;
    border-radius: 99px;

    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-gray-03);

    cursor: pointer;

    &:hover {
      background-color: var(--color-gray-03);
    }
  }
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 999px;
  border-width: 1px;
  border-style: solid;

  border-color: var(--avatar-color);
  background-color: color-mix(in srgb, var(--avatar-color) 50%, white);
  color: color-mix(in srgb, var(--avatar-color) 90%, black);

  width: 24px;
  height: 24px;
  padding: 2px;

  @include md {
    width: 28px;
    height: 28px;
    padding: 4px;

    border-width: 1.5px;
  }
}
</style>
