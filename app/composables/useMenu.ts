import { menus, type MenuThumbnailUpdate } from "@/utils/supabase/menus";
import { getMenuFamilyBySlug } from "@/utils/menu";
import type { Menu, MenuInsertType, MenuUpdateType } from "@/types/supabase";
import type { FlatMenu } from "@/types/menu";
import type { PostgrestError } from "@supabase/supabase-js";
import type { BreadcrumbItem } from "@/types/common";

export const useGetMenus = () => {
  const supabase = useSupabaseClient();
  return useAsyncData<Menu[], PostgrestError>("menus", () =>
    menus(supabase).getAll()
  );
};

export const useCreateMenu = () => {
  const supabase = useSupabaseClient();

  const createMenu = (formData: MenuInsertType, thumbnail?: File | null) =>
    menus(supabase).create(formData, thumbnail);

  return { createMenu };
};

export const useUpdateHidden = () => {
  const supabase = useSupabaseClient();

  const updateHidden = ({
    id,
    hidden,
  }: Pick<MenuUpdateType, "id" | "hidden">) =>
    menus(supabase).update({ id, hidden });

  return { updateHidden };
};

export const useUpdateMenu = () => {
  const supabase = useSupabaseClient();

  const updateMenu = (data: MenuUpdateType, thumbnail?: MenuThumbnailUpdate) =>
    menus(supabase).update(data, thumbnail);

  return { updateMenu };
};

export const useDeleteMenu = () => {
  const supabase = useSupabaseClient();

  const deleteMenu = (id: string) => menus(supabase).delete(id);

  return { deleteMenu };
};

export const useReorderMenus = () => {
  const supabase = useSupabaseClient();

  const reorderMenus = async (updates: FlatMenu[]) => {
    const { error } = await supabase.rpc("fn_menus_reorder", { updates });
    if (error) throw error;
  };

  return { reorderMenus };
};

export const useMenuBreadcrumb = ({
  slug,
}: {
  slug: MaybeRefOrGetter<string>;
}) => {
  const { data: menus, status } = useGetMenus();

  const menuFamily = computed(() =>
    getMenuFamilyBySlug(toValue(slug), menus.value ?? [])
  );

  const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const family = menuFamily.value;
    if (!family) return [];

    const { parent, menu } = family;
    return parent
      ? [
          { label: parent.name },
          { label: menu.name, href: `/blog/${menu.slug}` },
        ]
      : [{ label: menu.name, href: `/blog/${menu.slug}` }];
  });

  const breadcrumbStatus = computed(() => {
    if (breadcrumbItems.value.length === 0 || status.value === "error")
      return "error" as const;
    if (status.value === "pending") return "loading" as const;
    return "success" as const;
  });

  return { breadcrumbItems, breadcrumbStatus, menuFamily };
};
