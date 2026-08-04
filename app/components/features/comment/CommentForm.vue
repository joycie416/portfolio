<template>
  <Card
    title="댓글 작성"
    class="*:data-[slot=card-title]:text-base md:*:data-[slot=card-title]:text-lg"
  >
    <form class="flex flex-col gap-1" @submit.prevent="handleSubmitComment">
      <div class="flex flex-col md:flex-row gap-2">
        <InputGroup
          v-model="nickname"
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          required
          container-class="basis-1/2"
          :state="errors.nickname ? 'error' : 'success'"
          :hint="errors.nickname"
          :disabled="loading"
        />
        <InputGroup
          v-model="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          required
          :state="errors.password ? 'error' : 'success'"
          :hint="errors.password"
          container-class="basis-1/2"
          :disabled="loading"
        />
      </div>
      <InputGroup
        v-model="content"
        type="textarea"
        placeholder="내용을 입력해주세요."
        required
        :maxlength="1000"
        :state="errors.content ? 'error' : 'success'"
        :hint="errors.content"
        class="resize-none min-h-24"
        :disabled="loading"
      />
      <div class="flex justify-between items-center gap-2">
        <div class="flex items-center gap-2 text-red-04">
          <AlertTriangle class="size-4 shrink-0" />
          <p class="text-xs md:text-sm">
            비밀번호는 별도로 암호화되지 않습니다. 다른 곳에서 사용하는
            비밀번호는 입력하지 마세요.
          </p>
        </div>
        <Button
          class="w-fit self-end"
          :disabled="!meta.valid || loading"
          @click="handleSubmitComment"
        >
          <LoaderCircle v-if="loading" class="size-4 animate-spin" />
          <span v-else>등록</span>
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { Card, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { commentSchema } from "@/schemas/comment";
import { AlertTriangle, LoaderCircle } from "@lucide/vue";
import { toast } from "vue-sonner";

const props = defineProps<{ postId: number }>();

const emit = defineEmits<{
  "refresh-comments": [];
}>();

const { defineField, errors, meta, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(commentSchema),
  initialValues: {
    postId: props.postId,
    nickname: "",
    password: "",
    content: "",
  },
});

const [nickname] = defineField("nickname");
const [password] = defineField("password");
const [content] = defineField("content");

const { createComment } = useCreateComment();
const loading = ref(false);

const handleSubmitComment = handleSubmit(async () => {
  if (!meta.value.valid || loading.value) return;

  try {
    loading.value = true;
    await createComment({
      post_id: props.postId,
      nickname: toValue(nickname) ?? "",
      password: toValue(password) ?? "",
      content: toValue(content) ?? "",
    });
    emit("refresh-comments");
    resetForm();
    toast.success("댓글이 등록되었습니다.");
  } catch {
    toast.error("댓글 등록에 실패했습니다.");
  } finally {
    loading.value = false;
  }
});
</script>
