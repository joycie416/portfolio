<template>
  <div class="space-y-8 md:space-y-10 pb-10 md:pb-16">
    <TopCard
      :imgSrc="post?.thumbnail ?? undefined"
      class="h-80 md:h-100"
      contentClass="flex flex-col justify-between items-center"
    >
      <Breadcrumb
        :status="breadcrumbStatus"
        :items="breadcrumbItems"
        type="tag"
        error-message="메뉴 조회에 실패했습니다."
      />
      <h1 class="text-3xl leading-10 font-bold md:text-4xl md:leading-13">
        {{ post?.title }}
      </h1>
      <div class="px-3 py-1 flex items-center gap-2 bg-gray-09/50 rounded-full">
        <p class="text-sm text-text-gray-05">
          {{ formatDate(post?.created_at ?? "") }}
        </p>
        <Button
          variant="ghost"
          size="icon"
          class="size-5 p-0 text-text-gray-05 hover:bg-transparent"
          aria-label="copy-link"
          @click="copyLink"
        >
          <Share2 />
        </Button>
        <DropdownMenu v-if="isAuthenticated">
          <DropdownMenuTrigger
            class="size-5 p-0 flex items-center justify-center text-text-gray-05 border-2 border-text-gray-05 rounded-full hover:bg-transparent"
          >
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
    </TopCard>
    <!-- 게시글 본문 -->
    <div
      ref="contentRef"
      v-html="post?.content"
      class="tiptap tiptap--readonly"
    />
    <!-- 게시글 하단 -->
    <hr class="border border-px border-gray-06" />
    <RelatedPostList />
    <CommentSection :post-id="postId" />
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
  </div>
</template>

<script setup lang="ts">
import { Breadcrumb, ConfirmDialog } from "@/components/common";
import { TopCard } from "@/components/layout";
import { EllipsisVertical, Share2 } from "@lucide/vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentSection from "@/components/features/comment/CommentSection.vue";
import RelatedPostList from "@/components/features/post/RelatedPostList.vue";

definePageMeta({
  middleware: "validate-post",
});

const route = useRoute();
const postId = computed(() => Number(route.params.id));

const { breadcrumbItems, breadcrumbStatus } = useMenuBreadcrumb(
  () => route.params.slug as string
);

const { data, refresh } = useGetPost({
  id: postId.value,
  immediate: true,
});
const post = computed(() => data.value?.post);
const files = computed(() => data.value?.files);

const contentRef = ref<HTMLDivElement | null>(null);
useTiptapCodeHighlight(
  contentRef,
  computed(() => post.value?.content)
);

// ------------ SEO ------------
const runtimeConfig = useRuntimeConfig();
const siteUrl = runtimeConfig.public.siteUrl;

const title = computed(() => {
  if (post.value?.title) {
    return `${post.value.title} - Haein's Blog`;
  }
  return "Haein's Blog";
});
const ogImage = computed(() => {
  if (post.value?.thumbnail) {
    return post.value.thumbnail;
  }
  return `${siteUrl}/og-image-blog.png`;
});

useSeoMeta({
  title,
  description: post.value?.excerpt,
  ogTitle: post.value?.title,
  ogDescription: post.value?.excerpt,
  ogImage,
  ogUrl: `${siteUrl}/blog/${route.params.slug}/${route.params.id}`,
});

// ------------ 관리자 기능 ------------
const { isAuthenticated } = useAuth();

const onEditClick = () => {
  if (isAuthenticated.value) {
    navigateTo(`/blog/admin/posts/new/${route.params.id}`);
  } else {
    toast.error("로그인 후 이용해주세요.");
  }
};

const { bulkUpdateHidden } = useBulkPostActions();
const { deletePost } = useDeletePost();

const deleteConfirmOpen = ref(false);
const deleteLoading = ref(false);

const onChangeVisibilityClick = async () => {
  const postId = post.value?.id;
  if (!postId) return;

  const wasHidden = post.value.hidden;

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
    await refresh();
  } catch {
    toast.error("공개 여부 변경에 실패했습니다.");
  }
};

const onDeleteClick = () => {
  deleteConfirmOpen.value = true;
};

const handleDeleteConfirm = async () => {
  const postId = post.value?.id;
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

// ------------ 기타 ------------
const copyLink = () => {
  try {
    navigator.clipboard.writeText(`${siteUrl}${route.fullPath}`);
    toast.success("링크가 복사되었습니다.");
  } catch {
    toast.error("링크 복사에 실패했습니다.");
  }
};
</script>
