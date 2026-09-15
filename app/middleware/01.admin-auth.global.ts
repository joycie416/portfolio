import { START_LOCATION } from "vue-router";
import { AUTH_ROUTES } from "@/constants/supabase.auth";

// .global.ts: 모든 라우트에 적용되는 미들웨어

// 비로그인 사용자의 관리자 페이지 접근 차단 및 로그인 페이지로 리다이렉트
// 로그인 사용자의 로그인 페이지 접근 차단(기존 페이지 유지)
export default defineNuxtRouteMiddleware((to, from) => {
  // 관리자 페이지가 아닌 경우: 아무것도 하지 않음
  if (!to.path.startsWith("/blog/admin")) {
    return;
  }

  const { isAuthenticated } = useAuth();

  // 로그인 페이지로 이동하려는 경우
  if (to.path === AUTH_ROUTES.login) {
    // 로그인 상태가 아닌 경우: 아무것도 하지 않음
    if (!isAuthenticated.value) {
      return;
    }

    // 로그인 상태인 경우: 로그인 페이지 진입을 막고 기존 페이지 유지
    const cameFromAnotherPage = from.path !== to.path;

    // url에 직접 입력해서 로그인 페이지에 진입한 경우(하드 네비게이션)에는 /blog로 이동됨.
    // 하드 네비게이션한 경우 from 값이 존재하지 않음
    return navigateTo(
      cameFromAnotherPage ? from.fullPath : AUTH_ROUTES.defaultRedirect,
      { replace: true }
    );
  }

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
