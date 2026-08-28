import { AUTH_ROUTES } from "@/constants/supabase.auth";
// 리다이렉트 주소 반환용 유틸리티

// 내부 경로 안전성 검사
function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  const pathname = path.split("?")[0];
  return pathname !== AUTH_ROUTES.login;
}

function normalizeRedirectTarget(value: string, origin: string): string | null {
  // redirectQuery가 내부 경로인지 안전성 검사
  if (value.startsWith("/")) {
    return isSafeInternalPath(value) ? value : null;
  }

  try {
    const url = new URL(value);
    // 다른 도메인인 경우 리다이렉트 차단
    if (url.origin !== origin) {
      return null;
    }

    const path = `${url.pathname}${url.search}`;
    return isSafeInternalPath(path) ? path : null;
  } catch {
    return null;
  }
}

export function resolvePostLoginRedirect(
  redirectQuery: string | undefined,
  // 이전 페이지의 URL
  referrer: string | undefined,
  // same-origin 검증 기준
  origin: string
): string {
  // redirect 쿼리가 있는 경우
  if (redirectQuery) {
    const fromQuery = normalizeRedirectTarget(redirectQuery, origin);
    if (fromQuery) {
      return fromQuery;
    }
  }

  // referrer가 없는 경우: referrer 확인
  if (referrer) {
    try {
      const url = new URL(referrer);
      if (url.origin === origin) {
        const path = `${url.pathname}${url.search}`;
        const fromReferrer = normalizeRedirectTarget(path, origin);
        if (fromReferrer) {
          return fromReferrer;
        }
      }
    } catch {
      // ignore invalid referrer
    }
  }

  return AUTH_ROUTES.defaultRedirect;
}
