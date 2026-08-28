import type { LocationQueryValue } from "vue-router";

/**
 * route.query 값을 단일 문자열로 정규화하는 함수
 *
 * @param value - route.query 값(string | string[] | null | undefined)
 * @returns - 단일 문자열로 정규화된 값
 */
export function parseQueryParam(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

/**
 * route.query 값을 허용된 값만 통과, 아니면 fallback 반환하는 함수
 *
 * @param value - route.query 값(string | string[] | null | undefined)
 * @param allowed - 허용된 값들
 * @param fallback - 허용된 값이 아닐 때 반환할 값
 * @returns - 허용된 값만 통과, 아니면 fallback 반환된 값
 */
export function parseQueryEnum<T extends string>(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
  allowed: readonly T[],
  fallback: T
): T {
  const parsed = parseQueryParam(value);
  return parsed !== undefined && (allowed as readonly string[]).includes(parsed)
    ? (parsed as T)
    : fallback;
}
