import { AUTH_ROUTES } from "@/constants/supabase.auth";

// .global.ts: 모든 라우트에 적용되는 미들웨어

// 로그인 페이지 이동 시 리다이렉트 쿼리 추가
export default defineNuxtRouteMiddleware((to, from) => {
  // 로그인 페이지로 이동하지 않는 경우: 아무것도 하지 않음음
  if (to.path !== AUTH_ROUTES.login) {
    return;
  }

  // 이미 리다이렉트 쿼리가 있는 경우: 아무것도 하지 않음
  if (to.query.redirect) {
    return;
  }

  // 이전 페이지가 로그인 페이지가 아닌 경우: 리다이렉트 쿼리 추가
  const cameFromAnotherPage =
    from.path !== to.path && from.path !== AUTH_ROUTES.login;

  if (!cameFromAnotherPage) {
    return;
  }

  return navigateTo({
    path: AUTH_ROUTES.login,
    query: { redirect: from.fullPath },
  });
});
