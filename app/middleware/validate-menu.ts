import { menus } from "@/utils/supabase/menus";
import { useMenuRoute } from "@/composables/useMenuRoute";

const notFound = () =>
  createError({
    statusCode: 404,
    statusMessage: "존재하지 않는 메뉴입니다.",
  });

// 존재하는 메뉴인지 확인 후 없으면 404
export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient();

  const { setMenuId } = useMenuRoute();

  const slug = to.params.slug as string;

  try {
    const menu = await menus(supabase).getBySlug(slug);
    if (!menu) throw notFound();
    setMenuId(menu.id);
  } catch {
    setMenuId(null);
    throw notFound();
  }
});
