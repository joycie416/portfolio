<template>
  <form
    @submit.prevent="handleSubmitFilter"
    :class="cn('flex flex-col md:flex-row gap-2', props.class)"
  >
    <InputGroup
      v-model="query"
      type="text"
      label="검색"
      placeholder="검색어를 입력해주세요."
      :container-class="
        props.withVisibility ? 'w-full md:w-100' : 'w-full md:flex-[2]'
      "
    />
    <div
      :class="
        props.withVisibility ? 'flex flex-row gap-2 md:contents' : 'contents'
      "
    >
      <InputGroup
        v-model="menuId"
        type="dropdown"
        label="메뉴"
        :options="menuOptions"
        :container-class="
          props.withVisibility ? 'w-1/2 md:w-100' : 'w-full md:flex-1'
        "
      />
      <InputGroup
        v-if="props.withVisibility"
        v-model="visibility"
        type="dropdown"
        label="공개 여부"
        :options="visibilityOptions"
        container-class="w-1/2 md:w-100"
      />
    </div>
    <Button
      type="button"
      variant="outline"
      @click="reset"
      class="ml-auto md:mt-auto"
    >
      <RotateCcw class="size-4 md:size-5" />
    </Button>
  </form>
</template>

<script setup lang="ts">
import { InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "@lucide/vue";
import type { HTMLAttributes } from "vue";
import { postFilterSchema, type PostFilterForm } from "@/schemas/post";
import { cn } from "@/lib/utils";
import { toMenuOptions } from "@/utils/menu";
import { getVisibilityOptions } from "@/utils/post";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const props = defineProps<{
  withVisibility?: boolean;
  class?: HTMLAttributes["class"];
}>();

const { data: menus } = useGetAllMenus();
const menuOptions = computed(() => toMenuOptions(menus.value ?? []));

const visibilityOptions = getVisibilityOptions();

const DEFAULT_VALUES: PostFilterForm = {
  query: "",
  menuId: "all",
  visibility: "all",
};

const { getQuery, setQuery, clearQuery } = useQueryParams({
  ...DEFAULT_VALUES,
  page: "1",
});

const initialQueries = getQuery();

const {
  values: formValues,
  defineField,
  resetForm,
  handleSubmit,
} = useForm({
  validationSchema: toTypedSchema(postFilterSchema),
  initialValues: {
    ...DEFAULT_VALUES,
    query: initialQueries.query,
    menuId: initialQueries.menuId,
    visibility: initialQueries.visibility,
  },
});

const [query] = defineField("query");
const [menuId] = defineField("menuId");
const [visibility] = defineField("visibility");

// URL -> 폼 동기화 중에는 폼 값을 URL 값으로 동기화하는 것을 막아 순환 방지
let isSyncingFromUrl = false;

// 뒤로가기/앞으로가기 등으로 URL이 바뀌면 URL 값을 폼에 동기화
watch(
  () => getQuery(),
  (next) => {
    isSyncingFromUrl = true;
    resetForm({ values: next });
    nextTick(() => {
      isSyncingFromUrl = false;
    });
  }
);

// 메뉴 변경 시 즉시 반영
watch(
  () => formValues.menuId,
  (value) => {
    if (isSyncingFromUrl) return;
    setQuery({
      menuId: value,
      visibility: formValues.visibility,
      query: getQuery().query,
      // 페이지 초기화
    });
  }
);

// 공개 여부 변경 시 즉시 반영
watch(
  () => formValues.visibility,
  (value) => {
    if (isSyncingFromUrl) return;
    setQuery({
      visibility: value,
      menuId: formValues.menuId,
      query: getQuery().query,
      // 페이지 초기화
    });
  }
);

const handleSubmitFilter = handleSubmit(() => {
  setQuery({
    query: formValues.query?.trim() || "",
    menuId: formValues.menuId,
    visibility: formValues.visibility,
    // 페이지 초기화
  });
});

const reset = () => {
  resetForm();
  clearQuery();
};
</script>
