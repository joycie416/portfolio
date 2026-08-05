import { posts } from "@/utils/supabase/posts";

type ParsedId =
  | { kind: "absent" }
  | { kind: "invalid" }
  | { kind: "ok"; id: number };

const parseId = (raw: unknown): ParsedId => {
  if (raw == null || Array.isArray(raw) || raw === "")
    return { kind: "absent" };
  const n = Number(raw);
  if (!Number.isSafeInteger(n)) return { kind: "invalid" };
  return { kind: "ok", id: n };
};

const notFound = () =>
  createError({
    statusCode: 404,
    statusMessage: "존재하지 않는 게시글입니다.",
  });

const SKIP_KEY = "validate-edit-post:skip";

// 게시글/임시저장 글이 실제로 존재하는지 확인하고, 없으면 404
export default defineNuxtRouteMiddleware(async (to) => {
  // temp 쿼리 제거용 navigateTo 직후 재실행 → 바로 종료
  const skip = useState<string | null>(SKIP_KEY, () => null);
  if (skip.value === to.path) {
    skip.value = null;
    return;
  }

  const id = parseId(to.params.id);
  const tempId = parseId(to.query.temp);

  // 새 글 작성 (id/temp 없음) → 통과
  if (id.kind === "absent" && tempId.kind === "absent") return;

  let targetId: number;
  let isTemp: boolean;

  // params.id가 있으면 등록글, 없으면 임시저장 글
  if (id.kind === "ok") {
    targetId = id.id;
    isTemp = false;
  } else if (id.kind === "invalid") {
    throw notFound();
  } else if (tempId.kind === "ok") {
    targetId = tempId.id;
    isTemp = true;
  } else {
    throw notFound();
  }

  const supabase = useSupabaseClient();

  try {
    await posts(supabase).getById(targetId, isTemp);
  } catch {
    throw notFound();
  }

  // 등록글 id와 temp 쿼리가 함께 있으면, 검증 후 temp만 제거
  if (id.kind === "ok" && tempId.kind === "ok") {
    skip.value = to.path;
    const { temp: _, ...query } = to.query;
    return navigateTo({ path: to.path, query }, { replace: true });
  }
});
