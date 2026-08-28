import type { LocationQueryRaw } from "vue-router";
import { parseQueryParam } from "@/utils/query-params";

// 쿼리스트링-필터 값 동기화용 컴포저블
// defaults: 필터가 관리하는 키와 각 키의 기본값(URL에 노출하지 않을 값)
export function useQueryParams<T extends Record<string, string>>(defaults: T) {
  const route = useRoute();
  const router = useRouter();

  const keys = Object.keys(defaults) as (keyof T)[];

  // route.query -> 필터 값 (누락/빈 값은 기본값으로 보정)
  const getQuery = (): T => {
    const result = { ...defaults };

    for (const key of keys) {
      const parsed = parseQueryParam(route.query[key as string]);
      if (parsed !== undefined && parsed !== "") {
        result[key] = parsed as T[keyof T];
      }
    }

    return result;
  };

  // 필터 값 -> route.query (기본값/빈 값은 URL에서 제거, 그 외 쿼리는 유지)
  const setQuery = (values: Partial<T>) => {
    const query: LocationQueryRaw = { ...route.query };

    for (const key of keys) {
      const value = values[key];
      const isEmpty =
        value === undefined || value === "" || value === defaults[key];

      if (isEmpty) {
        query[key as string] = undefined;
      } else {
        query[key as string] = value as string;
      }
    }

    router.push({ query });
  };

  // 이 필터가 관리하는 키만 URL에서 제거 (나머지 쿼리는 유지)
  const clearQuery = () => {
    const query: LocationQueryRaw = { ...route.query };

    for (const key of keys) {
      query[key as string] = undefined;
    }

    router.push({ query });
  };

  return { getQuery, setQuery, clearQuery };
}
