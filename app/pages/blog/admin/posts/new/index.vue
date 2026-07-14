<template>
  <div class="flex-1 flex flex-col gap-5 md:gap-10">
    <div class="flex flex-col md:flex-row gap-2">
      <InputGroup
        type="text"
        v-model="title"
        :state="titleProps.state"
        :hint="titleProps.hint"
        :required="true"
        placeholder="제목을 입력해주세요."
        container-class="w-full"
        class="border-0 border-b rounded-none"
      />
      <InputGroup
        v-model="menuId"
        type="dropdown"
        :options="menuOptions"
        placeholder="메뉴 선택"
        container-class="w-full md:w-50"
      />
    </div>
    <TiptapEditor v-model="content" class="flex-1" />
    <Checkbox v-model="isHidden" label="숨김" class="w-fit" />
    <div class="space-y-2">
      <InputGroup
        type="text"
        v-model="tag"
        @keydown.enter="addTag"
        placeholder="태그를 입력해주세요."
        hint="태그는 공백을 포함하지 않습니다."
      />
      <div class="flex flex-wrap gap-1">
        <div
          v-for="tag in tags"
          d
          :key="tag"
          class="min-w-0 pl-2 pr-1 py-0.5 flex items-center gap-1 rounded-full bg-gray-02"
        >
          <p class="flex-1 text-sm truncate">{{ tag }}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            @click="removeTag(tag)"
            class="p-0.5 size-4 hover:bg-transparent"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-2">
      <Button type="button" variant="outline" class="w-full">
        임시저장 | 0
      </Button>
      <Button type="button" :disabled="!meta.valid" class="w-full">저장</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { Checkbox, InputGroup } from "@/components/common";
import { postSchema } from "@/schemas/post";
import type { InputGroupState } from "@/types/input-group";
import { TiptapEditor } from "@/components/tiptap";
import { Button } from "~/components/ui/button";
import { X } from "@lucide/vue";

const { defineField, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(postSchema),
});

const [title, titleProps] = defineField("title", (state) => ({
  props: {
    state: (state.errors[0] ? "error" : "success") as InputGroupState,
    hint: state.errors[0],
  },
}));
const [menuId] = defineField("menuId", (state) => ({
  props: {
    state: (state.errors[0] ? "error" : "success") as InputGroupState,
    hint: state.errors[0],
  },
}));
const [content] = defineField("content", (state) => ({
  props: {
    state: (state.errors[0] ? "error" : "success") as InputGroupState,
    hint: state.errors[0],
  },
}));
const [isHidden] = defineField("hidden");
const [tags] = defineField("tags");
const [titleImage, titleImageProps] = defineField("titleImage");

// ------------ 태그 ------------
const tag = ref("");

const addTag = () => {
  // 태그는 공백을 포함하지 않음 (양 끝뿐 아니라 중간 공백도 모두 제거)
  const newTag = tag.value.replace(/\s/g, "");
  if (newTag && !tags.value?.includes(newTag)) {
    tags.value = [...(tags.value ?? []), newTag];
  }
  tag.value = "";
};

const removeTag = (tag: string) => {
  tags.value = tags.value?.filter((t) => t !== tag) ?? [];
};

// ------------ 메뉴 ------------
const { data: menus } = useGetAllMenus();
const menuOptions = computed(() => toMenuOptions(menus.value ?? [], false));
watch(
  menuOptions,
  () => {
    if (menuId.value || menuOptions.value.length === 0) return;
    const defaultOption = menuOptions.value.find(
      (option) => option.label === "미분류"
    );
    menuId.value = defaultOption?.value ?? menuOptions.value[0]?.value ?? "";
  },
  { immediate: true }
);
</script>
