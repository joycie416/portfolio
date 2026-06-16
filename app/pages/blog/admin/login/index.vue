<template>
  <div class="w-screen h-screen">
    <Card
      title="관리자 로그인"
      class="w-[400px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 *:data-[slot='card-title']:text-center"
    >
      <form class="flex flex-col" @submit.prevent="handleSubmit">
        <InputGroup
          v-model="loginForm.email"
          type="text"
          label="이메일"
          placeholder="이메일을 입력해주세요."
        />
        <InputGroup
          v-model="loginForm.password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          containerClass="mt-3 mb-5"
        />
        <p v-if="error" class="mb-3 text-sm text-red-600">{{ error }}</p>
        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "로그인 중..." : "로그인" }}
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({ email: "", password: "" });
const { signIn, loading, error, isAuthenticated } = useAuth();
const { resolveRedirectTarget } = usePostLoginRedirect();

if (isAuthenticated.value) {
  await navigateTo(resolveRedirectTarget());
}

async function handleSubmit() {
  try {
    await signIn(loginForm.email, loginForm.password);
    await navigateTo(resolveRedirectTarget());
  } catch {
    // useAuth에서 error 상태를 설정함
  }
}
</script>
