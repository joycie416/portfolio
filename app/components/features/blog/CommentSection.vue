<template>
  <section id="comment" class="comment-section">
    <div class="comment-section__container">
      <h2 class="comment-section__title">최근 댓글</h2>
      <div class="comment__container">
        <div class="comment__list">
          <template v-if="!pending && !error && comments.length > 0">
            <CommentDetailItem
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
            />
          </template>
          <template v-else-if="!pending && !error && comments.length === 0">
            <Empty message="최근 댓글이 없습니다." class="h-50 md:h-80" />
          </template>
          <template v-else-if="pending && !error">
            <CommentDetailItemSkeleton v-for="i in 4" :key="i" />
          </template>
          <template v-else>
            <Empty
              message="최근 댓글 조회에 실패했습니다."
              class="h-50 md:h-80"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CommentDetailItem from "@/components/features/comment/CommentDetailItem.vue";
import CommentDetailItemSkeleton from "@/components/features/comment/CommentDetailItemSkeleton.vue";
import { Empty } from "@/components/common";
import { useGetCommentsWithSlug } from "@/composables/useComment";

const { data, pending, error } = useGetCommentsWithSlug({
  perPage: 4,
  page: 1,
  server: false,
  lazy: true,
});

const comments = computed(() => data.value?.data ?? []);
</script>

<style lang="scss" scoped>
.comment-section {
  background-color: var(--color-gray-01);

  &__container {
    width: 100%;
    max-width: 1024px;
    height: fit-content;
    min-height: fit-content;
    margin: 0 auto;
    padding: 40px 20px 64px;

    @include md {
      padding: 56px 24px 80px;
    }
  }

  &__title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-gray-10);

    @include md {
      margin-bottom: 28px;
      font-size: 28px;
    }
  }
}
</style>
