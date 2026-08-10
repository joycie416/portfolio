import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/extended-database.types";
import type { MenuInsertType, MenuUpdateType } from "@/types/supabase";

export type MenuThumbnailUpdate = {
  file?: File | null;
  remove?: boolean;
};

// 썸네일 URL 캐시 버스팅
// 썸네일 변경 후 이전 이미지 캐시가 남아있는 오류 방지
const withCacheBust = (url: string) => `${url}?t=${Date.now()}`;

const uploadThumbnail = async (
  client: SupabaseClient<Database>,
  id: string,
  file: File
) => {
  const { error } = await client.storage.from("menus").upload(id, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
};

const removeThumbnail = async (
  client: SupabaseClient<Database>,
  id: string
) => {
  const { error } = await client.storage.from("menus").remove([id]);
  if (error) throw error;
};

export const menus = (client: SupabaseClient<Database>) => ({
  getAll: async () => {
    const { data, error } = await client
      .from("menus")
      .select("*, posts(count)");
    if (error) throw error;
    return data;
  },
  update: async (formData: MenuUpdateType, thumbnail?: MenuThumbnailUpdate) => {
    const { error } = await client
      .from("menus")
      .update(formData)
      .eq("id", formData.id);
    if (error) throw new PostgrestError(error);

    if (thumbnail?.file) {
      await uploadThumbnail(client, formData.id, thumbnail.file);
      return;
    }

    if (thumbnail?.remove) {
      await removeThumbnail(client, formData.id);
    }
  },
  create: async (formData: MenuInsertType, thumbnail?: File | null) => {
    const { data, error } = await client
      .from("menus")
      .insert(formData)
      .select("id")
      .single();
    if (error) throw new PostgrestError(error);

    if (!thumbnail) return data;

    await uploadThumbnail(client, data.id, thumbnail);

    return data;
  },
  delete: async (id: string) => {
    const { error } = await client.from("menus").delete().eq("id", id);
    if (error) throw new PostgrestError(error);
    return;
  },
  getBySlug: async (slug: string) => {
    const { data, error } = await client
      .from("menus")
      .select("id, name, slug")
      .eq("slug", slug)
      .single();
    if (error) throw new PostgrestError(error);
    return data;
  },
  getThumbnailFile: async (id: string) => {
    const { data, error } = await client.storage.from("menus").download(id);
    if (error) throw error;
    return data;
  },
  hasThumbnail: async (id: string) => {
    const {
      data: { publicUrl },
    } = client.storage.from("menus").getPublicUrl(id);
    const res = await fetch(publicUrl, { method: "HEAD" });
    return res.ok ? withCacheBust(publicUrl) : false;
  },
  uploadThumbnail: (id: string, file: File) =>
    uploadThumbnail(client, id, file),
  removeThumbnail: (id: string) => removeThumbnail(client, id),
});
