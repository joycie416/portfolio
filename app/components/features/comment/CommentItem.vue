<template>
  <div class="flex flex-col gap-2 md:gap-4 py-5 px-4 border-b last:border-b-0">
    <div class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <div class="avatar" :style="{ '--avatar-color': avatarColor }">
          <avatar-icon class="size-full" />
        </div>
        <p class="font-semibold text-sm md:text-base">{{ comment.nickname }}</p>
        <hr class="w-px h-3.5 bg-gray-03 md:h-4" />
        <p class="text-text-gray-03 text-sm md:text-base">
          {{ formatDate(comment.created_at) }}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          class="p-1 hover:bg-gray-02 cursor-pointer rounded-sm transition-colors duration-150"
        >
          <EllipsisVertical class="size-4 md:size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-fit border-border">
          <DropdownMenuItem @click="onEditClick">수정</DropdownMenuItem>
          <DropdownMenuItem @click="onDeleteClick">삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="relative w-full min-h-20 md:min-h-16 px-1">
      <p
        v-if="!isEditing || isPasswordValid === INDETERMINATE"
        class="whitespace-pre-wrap text-sm md:text-base"
      >
        {{ comment.content }}
      </p>
      <div
        v-if="isPasswordValid === INDETERMINATE"
        class="rounded-md backdrop-blur-xs absolute -inset-3 flex items-center justify-center"
      >
        <form
          class="basis-1/2 md:basis-2/5 min-w-50 flex flex-col md:flex-row justify-center items-center gap-2"
          @submit.prevent="validatePassword"
        >
          <InputGroup
            type="password"
            v-model="password"
            label="비밀번호 확인"
            required
            container-class="w-full min-w-50"
            :enable-toggle="false"
          />
          <div class="flex gap-2 justify-center md:mt-7">
            <Button
              type="button"
              variant="outline"
              @click="handleCancelValidatePassword"
            >
              취소
            </Button>
            <Button type="submit">확인</Button>
          </div>
        </form>
      </div>
      <div v-if="isEditing && isPasswordValid === true">
        <InputGroup
          type="textarea"
          v-model="content"
          class="resize-none min-h-24"
          :maxlength="1000"
          :disabled="loading"
        />
        <div class="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            :disabled="loading"
            @click="handleCancelEdit"
          >
            취소
          </Button>
          <Button
            type="button"
            :disabled="loading"
            @click="handleUpdateComment"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
    <ConfirmDialog
      title="댓글 삭제"
      :open="deleteConfirmOpen"
      confirm-text="삭제"
      confirm-variant="destructive"
      :loading="loading"
      @confirm="handleDeleteComment"
      @cancel="handleCancelDelete"
    >
      댓글을 삭제할까요?
      <br />
      삭제한 댓글은 복구할 수 없습니다.
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from "@/types/supabase";
import { EllipsisVertical, Laugh, Smile, UserRound } from "@lucide/vue";
import { ConfirmDialog, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "vue-sonner";

const props = defineProps<{
  comment: Comment;
}>();

const emit = defineEmits<{
  "refresh-comments": [];
}>();

const { updateComment } = useUpdateComment();
const { deleteComment } = useDeleteComment();

const COLORS = [
  "var(--color-highlight-blue)",
  "var(--color-highlight-red)",
  "var(--color-highlight-yellow)",
  "var(--color-highlight-gray)",
];
const ICONS = [UserRound, Smile, Laugh];

const avatarColor = COLORS[props.comment.id % 4];
const avatarIcon = ICONS[props.comment.id % 3];

const INDETERMINATE = "indeterminate";
const isEditing = ref<boolean | typeof INDETERMINATE>(false);
const isDeleting = ref<boolean | typeof INDETERMINATE>(false);
const password = ref("");
const isPasswordValid = ref<boolean | typeof INDETERMINATE>(false);
const content = ref(props.comment.content);
const loading = ref(false);
const deleteConfirmOpen = ref(false);

const resetState = () => {
  password.value = "";
  content.value = props.comment.content;
  isPasswordValid.value = false;
  isEditing.value = false;
  isDeleting.value = false;
  deleteConfirmOpen.value = false;
};

const onEditClick = () => {
  password.value = "";
  content.value = props.comment.content;
  isDeleting.value = false;
  isPasswordValid.value = INDETERMINATE;
  isEditing.value = INDETERMINATE;
};

const onDeleteClick = () => {
  password.value = "";
  isEditing.value = false;
  isPasswordValid.value = INDETERMINATE;
  isDeleting.value = INDETERMINATE;
};

const validatePassword = async () => {
  if (loading.value) return;

  if (password.value !== props.comment.password) {
    toast.error("비밀번호가 일치하지 않습니다.");
    return;
  }

  isPasswordValid.value = true;

  if (isEditing.value === INDETERMINATE) {
    isEditing.value = true;
    return;
  }

  if (isDeleting.value === INDETERMINATE) {
    deleteConfirmOpen.value = true;
  }
};

const handleCancelDelete = () => {
  resetState();
};

const handleCancelValidatePassword = () => {
  resetState();
};

const handleUpdateComment = async () => {
  if (loading.value) return;

  const nextContent = content.value.trim();
  if (!nextContent) {
    toast.error("내용을 입력해주세요.");
    return;
  }

  try {
    loading.value = true;
    await updateComment({
      id: props.comment.id,
      content: nextContent,
    });
    toast.success("댓글이 수정되었습니다.");
    emit("refresh-comments");
    resetState();
  } catch {
    toast.error("댓글 수정에 실패했습니다.");
  } finally {
    loading.value = false;
  }
};

const handleCancelEdit = () => {
  resetState();
};

const handleDeleteComment = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    await deleteComment(props.comment.id);
    toast.success("댓글이 삭제되었습니다.");
    emit("refresh-comments");
    resetState();
  } catch {
    toast.error("댓글 삭제에 실패했습니다.");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
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

  width: 28px;
  height: 28px;
  padding: 4px;

  @include md {
    width: 32px;
    height: 32px;
    padding: 4px;

    border-width: 1.5px;
  }
}
</style>
