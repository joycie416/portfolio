import type { User } from "@supabase/supabase-js";
import { AUTH_STATE_KEYS } from "@/constants/supabase.auth";

export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  // 서버, 클라이언트 상태 동기화
  const user = useState<User | null>(AUTH_STATE_KEYS.user, () => null);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  user.value = authUser;

  // return 값이 없음 : 서버에서 로그인 정보를 조회해 클라이언트 상태에 주입하기 위함
});
