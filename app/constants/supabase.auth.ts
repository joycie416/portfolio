export const AUTH_STATE_KEYS = {
  user: "auth-user",
  loading: "auth-loading",
  error: "auth-error",
} as const;

export const AUTH_ROUTES = {
  login: "/blog/admin/login",
  defaultRedirect: "/blog",
} as const;

export const AUTH_ERROR_CODES = {
  invalid_credentials: "invalid_credentials",
  validation_failed: "validation_failed",
  refresh_token_already_used: "refresh_token_already_used",
  refresh_token_not_found: "refresh_token_not_found",
  request_timeout: "request_timeout",
} as const;

export const AUTH_ERROR_MESSAGES = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  validation_failed: "유효성 검사에 실패했습니다. 다시 시도해주세요.",
  refresh_token_already_used: "이미 사용된 리프레시 토큰입니다.",
  refresh_token_not_found: "리프레시 토큰을 찾을 수 없습니다.",
  request_timeout: "요청 시간이 초과되었습니다. 다시 시도해주세요.",
  signInFailed: "로그인에 실패했습니다. 다시 시도해주세요.",
  signOutFailed: "로그아웃에 실패했습니다. 다시 시도해주세요.",
} as const;

export function toAuthErrorMessage(code: string): string {
  if (
    Object.values(AUTH_ERROR_CODES).includes(
      code as keyof typeof AUTH_ERROR_CODES,
    )
  ) {
    return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES];
  }

  return "다시 시도해주세요.";
}
