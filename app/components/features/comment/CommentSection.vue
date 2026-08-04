<template>
  <div>
    <CommentForm :post-id="postId" @refresh-comments="refresh" />
    <div>
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @refresh-comments="refresh"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentForm from "./CommentForm.vue";
import CommentItem from "./CommentItem.vue";

const props = defineProps<{
  postId: number;
}>();

const { data, refresh } = useGetComments({ postId: props.postId });
const comments = computed(() => data.value?.data ?? []);
const totalComments = computed(() => data.value?.count ?? 0);
</script>
