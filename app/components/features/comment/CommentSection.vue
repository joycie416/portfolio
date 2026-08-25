<template>
  <div>
    <CommentForm :post-id="postId" @refresh-comments="refresh" />
    <div v-if="status === 'success' && comments.length > 0">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @refresh-comments="refresh"
      />
    </div>
    <EmptyComment
      v-else-if="status === 'success' && comments.length === 0"
      class="h-50 md:h-80"
    />
    <div v-else-if="status === 'pending' || status === 'idle'">
      <CommentItemSkeleton v-for="i in 2" :key="i" />
    </div>
    <div v-else>
      <Empty message="댓글 조회에 실패했습니다." class="h-50 md:h-80" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentForm from "./CommentForm.vue";
import CommentItem from "./CommentItem.vue";
import CommentItemSkeleton from "./CommentItemSkeleton.vue";
import EmptyComment from "./EmptyComment.vue";
import { Empty } from "@/components/common";

const props = defineProps<{
  postId: number;
}>();

const { data, refresh, status } = useGetComments({
  postId: () => props.postId,
  server: false,
  lazy: true,
});
const comments = computed(() => data.value?.data ?? []);
</script>
