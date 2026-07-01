<template>
  <form :class="cn('flex flex-col md:flex-row gap-2', props.class)">
    <InputGroup
      v-model="form.query"
      type="text"
      label="검색"
      placeholder="검색어를 입력해주세요."
      container-class="w-full md:w-100"
    />
    <InputGroup
      v-model="form.menuId"
      type="dropdown"
      label="메뉴"
      :options="menuOptions"
      container-class="w-full md:w-100"
    />
    <InputGroup
      v-model="form.visibility"
      type="dropdown"
      label="공개 여부"
      :options="visibilityOptions"
      container-class="w-full md:w-100"
    />
  </form>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { PostFilterForm } from "@/types/post";
import { cn } from "@/lib/utils";
import { InputGroup } from "~/components/common";
import { toMenuOptions } from "~/utils/menu";
import type { InputOption } from "~/types/common";

const props = defineProps<{
  withVisibility?: boolean;
  class?: HTMLAttributes["class"];
}>();

const form = defineModel<PostFilterForm>({ required: true });

const { data: menus } = useGetAllMenus();

const menuOptions = computed(() => toMenuOptions(menus.value ?? []));

const visibilityOptions: InputOption<string>[] = [
  { label: "전체", value: "all" },
  { label: "공개", value: "public" },
  { label: "비공개", value: "private" },
];
</script>
