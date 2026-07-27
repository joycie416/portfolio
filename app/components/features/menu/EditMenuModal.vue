<template>
  <Dialog :open="true" :title="menu ? '메뉴 수정' : '메뉴 추가'">
    <InputGroup
      v-model="name"
      type="text"
      label="메뉴명"
      placeholder="메뉴명을 입력해주세요."
      required
      :state="errors.name ? 'error' : 'success'"
      :hint="errors.name"
    />
    <InputGroup
      v-model="slug"
      type="text"
      label="Slug"
      placeholder="Slug를 입력해주세요."
      :maxlength="16"
      required
      :state="errors.slug ? 'error' : 'success'"
      :hint="errors.slug || 'slug는 가급적 변경하지 않는 것이 좋습니다.'"
    />
    <Checkbox v-model="hidden" label="숨김" />
    <template #footer>
      <Button variant="destructive" @click="close">취소</Button>
      <Button
        variant="default"
        :disabled="!meta.valid || !meta.dirty"
        @click="save"
      >
        저장
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { MenuInsertType, Menu, MenuUpdateType } from "@/types/supabase";
import { Dialog, InputGroup, Checkbox } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useForm } from "vee-validate";
import { menuSchema } from "@/schemas/menu";
import { toTypedSchema } from "@vee-validate/zod";

const props = defineProps<{
  menu: Menu | null;
}>();

const { defineField, errors, meta, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(menuSchema),
  initialValues: {
    name: props.menu?.name ?? "",
    slug: props.menu?.slug ?? "",
    hidden: props.menu?.hidden ?? false,
  },
});

const [name] = defineField("name");
const [slug] = defineField("slug");
const [hidden] = defineField("hidden");

watch(
  () => props.menu,
  (newVal) => {
    if (newVal) {
      resetForm({
        values: {
          name: newVal.name,
          hidden: newVal.hidden,
        },
      });
    }
  }
);

const emit = defineEmits<{
  close: [];
  create: [data: MenuInsertType];
  edit: [data: MenuUpdateType];
}>();

const close = () => emit("close");
const save = handleSubmit((values) => {
  if (!meta.value.valid) return;

  if (props.menu && meta.value.dirty) {
    const { id, parent_id, order_idx } = props.menu;
    emit("edit", {
      id,
      parent_id,
      order_idx,
      name: values.name,
      slug: values.slug,
      hidden: values.hidden,
    });
  } else {
    emit("create", {
      name: values.name,
      slug: values.slug,
      parent_id: null,
      order_idx: 0,
      hidden: values.hidden,
    });
  }
});
</script>
