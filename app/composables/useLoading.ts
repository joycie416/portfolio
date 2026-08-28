const LOADING_STATE_KEY = "app-loading";

/**
 * 로딩 오버레이 상태 관리
 * useState를 사용해 앱 전체에서 하나의 상태를 공유한다.
 */
export const useLoading = () => {
  const loading = useState(LOADING_STATE_KEY, () => false);

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    loading,
    setLoading,
  };
};
