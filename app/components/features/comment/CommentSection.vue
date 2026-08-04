<template>
  <div>
    <CommentForm :post-id="postId" @refresh-comments="refresh" />
    <div>
      <div v-for="comment in comments" :key="comment.id">
        <p>{{ comment.nickname }}</p>
        <p>{{ comment.created_at }}</p>
        <p class="whitespace-pre-wrap">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentForm from "./CommentForm.vue";

const props = defineProps<{
  postId: number;
}>();

const { data, refresh } = useGetComments({ postId: props.postId });
const comments = computed(() => data.value?.data ?? []);
const totalComments = computed(() => data.value?.count ?? 0);
</script>
