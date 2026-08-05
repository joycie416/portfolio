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

const SKIP_KEY = "validate-post:skip";

// 게시글 존재 확인 후, URL slug가 해당 메뉴와 다르면 올바른 slug로 replace
export default defineNuxtRouteMiddleware(async (to) => {
  // slug replace용 navigateTo 직후 재실행 → 바로 종료
  const skip = useState<string | null>(SKIP_KEY, () => null);
  if (skip.value === to.path) {
    skip.value = null;
    return;
  }

  const id = parseId(to.params.id);
  if (id.kind !== "ok") throw notFound();

  const routeSlug = to.params.slug;
  if (typeof routeSlug !== "string" || !routeSlug) throw notFound();

  const supabase = useSupabaseClient();

  let menuId: string;
  try {
    const post = await posts(supabase).getById(id.id);
    menuId = post.menu_id;
  } catch {
    throw notFound();
  }

  const { data: menu, error } = await supabase
    .from("menus")
    .select("slug")
    .eq("id", menuId)
    .single();

  if (error || !menu) throw notFound();

  if (menu.slug !== routeSlug) {
    const path = `/blog/${menu.slug}/${id.id}`;
    skip.value = path;
    return navigateTo(
      { path, query: to.query, hash: to.hash },
      { replace: true }
    );
  }
});
