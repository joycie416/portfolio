import type { User } from "@supabase/supabase-js";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_STATE_KEYS,
  toAuthErrorMessage,
} from "@/constants/supabase.auth";

export function useAuth() {
  const supabase = useSupabaseClient();
  const user = useState<User | null>(AUTH_STATE_KEYS.user, () => null);
  const loading = useState(AUTH_STATE_KEYS.loading, () => false);
  const error = useState<string | null>(AUTH_STATE_KEYS.error, () => null);

  const isAuthenticated = computed(() => user.value !== null);

  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    loading.value = false;

    if (signInError) {
      error.value = toAuthErrorMessage(signInError.code ?? "signInFailed");
      throw signInError;
    }

    user.value = data.user;
    return data;
  }

  async function signOut() {
    loading.value = true;
    error.value = null;

    const { error: signOutError } = await supabase.auth.signOut();

    loading.value = false;

    if (signOutError) {
      error.value = AUTH_ERROR_MESSAGES.signOutFailed;
      throw signOutError;
    }

    user.value = null;
  }

  return {
    user: readonly(user),
    isAuthenticated,
    loading: readonly(loading),
    error: readonly(error),
    signIn,
    signOut,
  };
}
