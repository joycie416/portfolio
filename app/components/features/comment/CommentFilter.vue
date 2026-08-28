<template>
  <form
    :class="cn('flex flex-col md:flex-row gap-2', props.class)"
    @submit.prevent="handleSubmitFilter"
  >
    <InputGroup
      v-model="query"
      type="text"
      label="검색"
      placeholder="검색어를 입력해주세요."
      container-class="w-full"
    />
    <Button
      type="button"
      variant="outline"
      class="ml-auto md:mt-auto"
      @click="reset"
    >
      <RotateCcw class="size-4 md:size-5" />
    </Button>
  </form>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "@lucide/vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { getQuery, setQuery, clearQuery } = useQueryParams({
  query: "",
  page: "1",
});

const initialQueries = getQuery();

const query = ref(initialQueries.query);

// 뒤로가기/앞으로가기 등으로 URL이 바뀌면 URL 값을 폼에 동기화
watch(
  () => getQuery().query,
  (next) => {
    query.value = next;
  }
);

const handleSubmitFilter = () => {
  setQuery({
    query: query.value?.trim() || "",
    // 페이지 초기화
  });
};

const reset = () => {
  query.value = "";
  clearQuery();
};
</script>
