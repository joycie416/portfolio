export const usePagination = () => {
  const router = useRouter();
  const route = useRoute();

  const page = computed(() => Number(parseQueryParam(route.query.page)) || 1);

  const onPageChange = (page: number) => {
    router.push({ query: { ...route.query, page: page.toString() } });
  };

  return { page, onPageChange };
};
