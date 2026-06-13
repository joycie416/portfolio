<template>
  <div class="w-screen h-screen">
    <Card
      title="관리자 로그인"
      class="w-[400px] h-[300px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 *:data-[slot='card-title']:text-center"
    >
      <InputGroup
        v-model="loginForm.email"
        type="text"
        label="이메일"
        placeholder="이메일을 입력해주세요."
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, InputGroup } from "@/components/common";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({ email: "", password: "" });

watch(
  () => loginForm.email,
  (newEmail, oldEmail) => {
    console.log("email:", oldEmail, "→", newEmail);
  },
);
</script>
