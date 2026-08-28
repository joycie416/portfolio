import { resolvePostLoginRedirect } from "@/utils/auth-redirect";

// 로그인 후 리다이렉트 주소 반환용 컴포저블
export function usePostLoginRedirect() {
  const route = useRoute();
  const requestURL = useRequestURL();
  const refererHeader = import.meta.server
    ? useRequestHeaders(["referer"]).referer
    : undefined;

  function resolveRedirectTarget() {
    const redirectQuery =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : undefined;
    const referrer = import.meta.client
      ? document.referrer || undefined
      : refererHeader;

    return resolvePostLoginRedirect(redirectQuery, referrer, requestURL.origin);
  }

  return { resolveRedirectTarget };
}
