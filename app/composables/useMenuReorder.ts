import type { MenuGroup, FlatMenu } from "@/types/menu";
import type { Menu } from "@/types/supabase";
import { flattenMenuGroups } from "@/utils/menu";

/**
 * 메뉴 순서 변경 컴포저블
 * @param menus - 서버 원본 데이터
 * @param refresh - 메뉴 목록 새로고침 함수
 * @returns 드래그앤드롭용 데이터, 메뉴 순서 변경 상태 및 함수
 */
export const useMenuReorder = (
  menus: { readonly value: Menu[] | null | undefined },
  refresh: () => Promise<void>
) => {
  // 드래그앤드롭 모드에서 사용할 형태로 변환
  const transformedMenus = computed(() =>
    menus.value ? buildMenuTree(menus.value) : []
  );

  const localMenus = ref<MenuGroup[]>([]);

  // 서버 데이터 로드 시점의 순서 스냅샷 (plain 값 -> 이후 객체 변이에 영향받지 않음)
  const originalFlat = ref<FlatMenu[]>([]);

  watch(
    transformedMenus,
    (val) => {
      originalFlat.value = flattenMenuGroups(val); // 공유 참조 오염 전에 스냅샷 저장
      localMenus.value = val;
    },
    { immediate: true }
  );

  // 미분류 메뉴
  const fixedMenu = computed(() => localMenus.value[0]);

  // 드래그앤드롭 시 순서 변경 사항을 반영할 데이터 (미분류 메뉴 제외)
  // 드래그앤드롭 과정에서 children 배열 변경되는 경우 transformedMenus, localMenus 객체도 영향 받음(오염)
  const draggableMenus = computed({
    get: () => localMenus.value.slice(1),
    set: (val) => {
      localMenus.value = localMenus.value[0]
        ? [localMenus.value[0], ...val]
        : val;
    },
  });

  const hasOrderChanges = ref(false);
  const isSavingOrder = ref(false);

  // 현재 순서 변경 중인 메뉴 id (변경 사항이 없으면 항상 null)
  const activeMenuId = ref<string | null>(null);

  // 드래그로 잡은 메뉴 id (드래그 시작 시점에 기록)
  const draggingMenuId = ref<string | null>(null);

  const startDrag = (id: string) => {
    draggingMenuId.value = id;
  };

  // 드래그 종료 시점에 호출.
  // 드롭으로 draggableMenus가 갱신된 뒤 hasOrderChanges 재계산(flush: 'pre' watcher)이
  // 끝나도록 nextTick을 기다린 다음, 실제 변경이 있을 때만 드래그한 메뉴를 활성 상태로 둔다.
  // 변경 없이 제자리에 놓으면 activeMenuId가 남지 않아 다른 메뉴 핸들이 잠기지 않는다.
  const endDrag = async () => {
    await nextTick();
    activeMenuId.value = hasOrderChanges.value ? draggingMenuId.value : null;
  };

  watch(
    localMenus,
    (current) => {
      const curr = flattenMenuGroups(current);
      if (originalFlat.value.length !== curr.length) {
        hasOrderChanges.value = false;
        return;
      }
      const originalMap = new Map(originalFlat.value.map((m) => [m.id, m]));
      hasOrderChanges.value = curr.some((m) => {
        const orig = originalMap.get(m.id);
        return (
          orig &&
          (orig.order_idx !== m.order_idx || orig.parent_id !== m.parent_id)
        );
      });
    },
    // 자식 메뉴 children 배열 변화까지 감지
    { deep: true }
  );

  // 변경 사항이 없으면 활성화 메뉴 제거
  watch(hasOrderChanges, (changed) => {
    if (!changed) activeMenuId.value = null;
  });

  const { reorderMenus } = useReorderMenus();

  const save = async () => {
    const current = flattenMenuGroups(localMenus.value);
    const originalMap = new Map(originalFlat.value.map((m) => [m.id, m]));
    const diff = current.filter((m) => {
      const orig = originalMap.get(m.id);
      return (
        orig &&
        (orig.order_idx !== m.order_idx || orig.parent_id !== m.parent_id)
      );
    });
    if (!diff.length) return;
    isSavingOrder.value = true;
    try {
      await reorderMenus(diff);
      await refresh();
    } finally {
      isSavingOrder.value = false;
    }
  };

  const cancel = () => {
    activeMenuId.value = null;
    draggingMenuId.value = null;
    // transformedMenus는 객체 참조 공유로 오염됐을 수 있으므로 (draggableMenus 위 주석 참고),
    // 원본 서버 데이터(menus)에서 직접 재생성
    if (menus.value) {
      localMenus.value = buildMenuTree(menus.value);
    }
  };

  return {
    transformedMenus,
    fixedMenu,
    draggableMenus,
    hasOrderChanges,
    activeMenuId,
    startDrag,
    endDrag,
    loading: isSavingOrder,
    save,
    cancel,
  };
};
