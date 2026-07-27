import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { serverSupabaseClient } from "@/utils/supabase/supabase.server";

export function useSupabaseClient(): SupabaseClient<Database> {
  // 서버 환경에서는 매 요청마다 새로운 인스턴스를 생성 (쿠키를 매번 읽어와야 하기 때문)
  if (import.meta.server) {
    const event = useRequestEvent();
    if (!event) throw new Error("useSupabaseClient: no request event");
    return serverSupabaseClient(event);
  }
  // 클라이언트 환경에서는 singleton 패턴 (plugin에서 생성한 인스턴스 사용)
  return useNuxtApp().$supabase;
}
