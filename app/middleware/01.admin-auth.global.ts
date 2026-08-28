import { AUTH_ROUTES } from "@/constants/supabase.auth";

// .global.ts: 모든 라우트에 적용되는 미들웨어

// 비로그인 사용자의 관리자 페이지 접근 차단 및 로그인 페이지로 리다이렉트
export default defineNuxtRouteMiddleware((to) => {
  // 관리자 페이지가 아닌 경우: 아무것도 하지 않음
  if (!to.path.startsWith("/blog/admin")) {
    return;
  }

  // 로그인 페이지인 경우: 아무것도 하지 않음
  if (to.path === AUTH_ROUTES.login) {
    return;
  }

  const { isAuthenticated } = useAuth();

  // 로그인 상태인 경우: 아무것도 하지 않음
  if (isAuthenticated.value) {
    return;
  }

  // 로그인 상태가 아닌 경우: 로그인 페이지로 리다이렉트
  return navigateTo({
    path: AUTH_ROUTES.login,
    query: { redirect: to.fullPath },
  });
});
