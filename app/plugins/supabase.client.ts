import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { AUTH_STATE_KEYS } from "@/constants/supabase.auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const supabase = createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabasePublishableKey
  );

  // 서버, 클라이언트 상태 동기화
  const user = useState<User | null>(AUTH_STATE_KEYS.user, () => null);

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null;
  });

  return { provide: { supabase } };
});
