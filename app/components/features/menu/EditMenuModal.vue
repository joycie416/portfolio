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
      :disabled="loading"
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
      :disabled="loading"
    />
    <Checkbox v-model="hidden" label="숨김" :disabled="loading" />
    <InputFilePreview
      v-model="thumbnail"
      :url="existingUrl"
      label="썸네일"
      state="success"
      :disabled="loading || thumbnailLoading"
      @remove="onThumbnailRemove"
    />
    <template #footer>
      <Button variant="destructive" @click="close" :disabled="loading">
        취소
      </Button>
      <Button variant="default" :disabled="!canSave" @click="save">저장</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { MenuInsertType, Menu, MenuUpdateType } from "@/types/supabase";
import { menus, type MenuThumbnailUpdate } from "@/utils/supabase/menus";
import {
  Dialog,
  InputGroup,
  Checkbox,
  InputFilePreview,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { useForm } from "vee-validate";
import { menuSchema } from "@/schemas/menu";
import { toTypedSchema } from "@vee-validate/zod";

const props = defineProps<{
  menu: Menu | null;
}>();

const supabase = useSupabaseClient();

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

const thumbnail = ref<File | null>(null);
const existingUrl = ref<string | undefined>(undefined);
const removed = ref(false); // 기존 썸네일 제거 여부
const thumbnailLoading = ref(false);

const thumbnailDirty = computed(() => !!thumbnail.value || removed.value);

const canSave = computed(
  () =>
    meta.value.valid &&
    (meta.value.dirty || thumbnailDirty.value) &&
    !loading.value &&
    !thumbnailLoading.value
);

const resetThumbnailState = () => {
  thumbnail.value = null;
  existingUrl.value = undefined;
  removed.value = false;
};

// 썸네일 확인 및 미리보기 표시
const loadExistingThumbnail = async (id: string) => {
  thumbnailLoading.value = true;
  try {
    const result = await menus(supabase).hasThumbnail(id);
    existingUrl.value = result || undefined;
    thumbnail.value = null;
    removed.value = false;
  } finally {
    thumbnailLoading.value = false;
  }
};

// x 누르는 경우 기존 및 신규 썸네일 제거
// 수정 중 기존 썸네일 복구 원할 경우 취소 후 재진행 필요
const onThumbnailRemove = () => {
  if (existingUrl.value) {
    removed.value = true;
  }
  existingUrl.value = undefined;
};

watch(
  () => props.menu,
  (newVal) => {
    if (newVal) {
      resetForm({
        values: {
          name: newVal.name,
          slug: newVal.slug,
          hidden: newVal.hidden,
        },
      });
      loadExistingThumbnail(newVal.id);
    } else {
      resetThumbnailState();
    }
  },
  { immediate: true }
);

const emit = defineEmits<{
  close: [];
  create: [data: MenuInsertType, thumbnail: File | null];
  edit: [data: MenuUpdateType, thumbnail: MenuThumbnailUpdate];
}>();

const close = () => emit("close");

const loading = ref(false);

const save = handleSubmit((values) => {
  if (!meta.value.valid) return;
  if (!meta.value.dirty && !thumbnailDirty.value) return;

  loading.value = true;
  try {
    if (props.menu) {
      const { id, parent_id, order_idx } = props.menu;
      emit(
        "edit",
        {
          id,
          parent_id,
          order_idx,
          name: values.name,
          slug: values.slug,
          hidden: values.hidden,
        },
        {
          file: thumbnail.value,
          remove: removed.value && !thumbnail.value,
        }
      );
    } else {
      emit(
        "create",
        {
          name: values.name,
          slug: values.slug,
          parent_id: null,
          order_idx: 0,
          hidden: values.hidden,
        },
        thumbnail.value
      );
    }
  } finally {
    loading.value = false;
  }
});
</script>
