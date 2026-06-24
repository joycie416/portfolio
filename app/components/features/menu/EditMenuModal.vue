<template>
  <Dialog :open="true" :title="menu ? '메뉴 수정' : '메뉴 추가'">
    <InputGroup v-model="form.name" type="text" label="메뉴 이름" />
    <InputGroup
      v-model="hiddenModel"
      type="checkbox"
      :options="[{ label: '숨김', value: 'true' }]"
    />
    <template #footer>
      <Button variant="destructive" @click="close">취소</Button>
      <Button variant="default" @click="save">저장</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { MenuInsertType, Menu, MenuUpdateType } from "@/types/supabase";
import { Dialog, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";

const props = withDefaults(
  defineProps<{
    menu: Menu | null;
  }>(),
  {
    menu: null,
  }
);

const form = ref<MenuInsertType>({
  name: "",
  parent_id: null,
  order_idx: 0,
  hidden: false,
});

watch(
  () => props.menu,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        parent_id: newVal.parent_id,
        order_idx: newVal.order_idx,
        hidden: newVal.hidden,
      };
    }
  },
  { immediate: true }
);

const hiddenModel = computed({
  get: () => (form.value.hidden ? ["true"] : []) as string[],
  set: (val: string[]) => {
    form.value.hidden = val.includes("true");
  },
});

const emit = defineEmits<{
  close: [];
  create: [data: MenuInsertType];
  edit: [data: MenuUpdateType];
}>();

const close = () => emit("close");
const save = () => {
  if (props.menu) {
    const { id, parent_id, order_idx } = props.menu;
    emit("edit", {
      id,
      parent_id,
      order_idx,
      name: form.value.name,
      hidden: form.value.hidden,
    });
  } else {
    emit("create", form.value);
  }
};
</script>
