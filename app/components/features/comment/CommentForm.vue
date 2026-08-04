<template>
  <Card title="댓글 작성" class="*:data-[slot=card-title]:text-lg">
    <form class="flex flex-col gap-2">
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
      />
      <Button class="w-fit self-end" :disabled="!meta.valid">추가</Button>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { Card, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { commentSchema } from "@/schemas/comment";

const props = defineProps<{ postId: number }>();

const { defineField, errors, meta } = useForm({
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
</script>
