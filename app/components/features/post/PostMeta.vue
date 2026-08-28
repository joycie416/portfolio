<template>
  <div class="date-and-share" :data-type="props.type">
    <p class="text-sm">
      {{ formatDate(post?.created_at ?? "") }}
    </p>
    <Button
      variant="ghost"
      size="icon"
      class="date-and-share__button"
      aria-label="copy-link"
      @click="copyLink"
    >
      <Share2 />
    </Button>
    <DropdownMenu v-if="isAuthenticated">
      <DropdownMenuTrigger class="date-and-share__trigger">
        <EllipsisVertical class="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-fit">
        <DropdownMenuItem @click="onEditClick">수정</DropdownMenuItem>
        <DropdownMenuItem @click="onChangeVisibilityClick">
          {{ post?.hidden ? "공개" : "비공개" }}
        </DropdownMenuItem>
        <DropdownMenuItem @click="onDeleteClick">삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <ConfirmDialog
    title="게시글 삭제"
    :open="deleteConfirmOpen"
    confirm-text="삭제"
    confirm-variant="destructive"
    :loading="deleteLoading"
    @confirm="handleDeleteConfirm"
    @cancel="deleteConfirmOpen = false"
  >
    이 게시글을 삭제할까요?
    <br />
    삭제한 게시글은 복구할 수 없습니다.
  </ConfirmDialog>
</template>

<script setup lang="ts">
import type { Post } from "@/types/supabase";
import { ConfirmDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Share2 } from "@lucide/vue";
import { toast } from "vue-sonner";

const props = withDefaults(
  defineProps<{
    post: Post;
    type?: "default" | "badge";
  }>(),
  {
    type: "default",
  }
);

const emit = defineEmits<{
  refreshPost: [];
}>();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

const { isAuthenticated } = useAuth();

const onEditClick = () => {
  if (isAuthenticated.value) {
    navigateTo(`/blog/admin/posts/new/${props.post.id}`);
  } else {
    toast.error("로그인 후 이용해주세요.");
  }
};

const { bulkUpdateHidden } = useBulkPostActions();
const { deletePost } = useDeletePost();

const deleteConfirmOpen = ref(false);
const deleteLoading = ref(false);

const onChangeVisibilityClick = async () => {
  const postId = props.post.id;
  if (!postId) return;

  const wasHidden = props.post.hidden;

  try {
    const failures = await bulkUpdateHidden([postId], !wasHidden);
    if (failures.length > 0) {
      toast.error("공개 여부 변경에 실패했습니다.");
      return;
    }
    toast.success(
      wasHidden
        ? "게시글이 공개되었습니다."
        : "게시글이 비공개로 변경되었습니다."
    );
    emit("refreshPost");
  } catch {
    toast.error("공개 여부 변경에 실패했습니다.");
  }
};

const onDeleteClick = () => {
  deleteConfirmOpen.value = true;
};

const handleDeleteConfirm = async () => {
  const postId = props.post.id;
  if (!postId || deleteLoading.value) return;

  deleteLoading.value = true;
  try {
    await deletePost(postId);
    toast.success("게시글이 삭제되었습니다.");
    await navigateTo(`/blog/${route.params.slug}`);
  } catch {
    toast.error("게시글 삭제에 실패했습니다.");
  } finally {
    deleteLoading.value = false;
    deleteConfirmOpen.value = false;
  }
};

const copyLink = () => {
  try {
    navigator.clipboard.writeText(`${siteUrl}${route.fullPath}`);
    toast.success("링크가 복사되었습니다.");
  } catch {
    toast.error("링크 복사에 실패했습니다.");
  }
};
</script>

<style lang="scss" scoped>
.date-and-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-gray-03);

  &__button,
  &__trigger {
    width: 1.125rem;
    height: 1.125rem;
    padding: 0;
    color: inherit;

    @include md {
      width: 1.25rem;
      height: 1.25rem;
    }

    &:hover {
      background-color: transparent;
    }
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid currentColor;
    border-radius: 999px;

    @include md {
      border-width: 2px;
    }
  }

  &[data-type="badge"] {
    padding: 0.125rem 0.5rem;
    background-color: color-mix(in srgb, var(--color-gray-09) 50%, transparent);
    border-radius: 999px;
    color: var(--color-text-gray-05);

    @include md {
      padding: 0.25rem 0.75rem;
    }
  }
}
</style>
