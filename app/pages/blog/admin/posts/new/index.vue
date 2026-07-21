<template>
  <div class="flex-1 flex flex-col gap-5 md:gap-6">
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
    <TiptapEditor
      ref="editorRef"
      v-model="content"
      v-model:thumbnail="thumbnail"
      class="flex-1"
    />
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
      <Button type="button" variant="outline" class="w-full gap-0">
        임시저장
        <span class="w-px h-4 ml-3 mr-2 bg-text-gray-01" />
        <span
          class="px-1 hover:text-primary-600"
          @click.stop="openTempPostModal"
        >
          0
        </span>
      </Button>
      <Button
        type="button"
        :disabled="!meta.valid"
        class="w-full"
        @click="savePost"
      >
        저장
      </Button>
    </div>
  </div>
  <TempPostModal :open="tempPostModalOpen" @close="closeTempPostModal" />
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "vue-sonner";
import { Checkbox, InputGroup } from "@/components/common";
import { postSchema } from "@/schemas/post";
import type { InputGroupState } from "@/types/input-group";
import type { PostFile, PostInsertType } from "@/types/supabase";
import { TiptapEditor } from "@/components/tiptap";
import { Button } from "~/components/ui/button";
import { X } from "@lucide/vue";
import TempPostModal from "@/components/features/post/TempPostModal.vue";

const { setValues, defineField, meta } = useForm({
  validationSchema: toTypedSchema(postSchema),
  initialValues: {
    title: "",
    menuId: "",
    content: "",
    hidden: false,
    tags: [],
    thumbnail: null,
  },
  initialTouched: {
    title: false,
    menuId: true,
    content: true,
    hidden: true,
    tags: true,
    thumbnail: true,
  },
});

const [title, titleProps] = defineField("title", (state) => ({
  props: {
    state: (state.touched && state.errors[0]
      ? "error"
      : "success") as InputGroupState,
    hint: state.touched ? state.errors[0] : undefined,
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
const [thumbnail] = defineField("thumbnail");

// ------------ 태그 ------------
const tag = ref("");

const addTag = () => {
  // 태그는 공백을 포함하지 않음 (양 끝뿐 아니라 중간 공백도 모두 제거)
  const newTag = tag.value.replace(/\s/g, "");
  if (newTag && !tags.value?.includes(newTag)) {
    setValues({ tags: [...(tags.value ?? []), newTag] });
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
    setValues(
      { menuId: defaultOption?.value ?? menuOptions.value[0]?.value ?? "" },
      false
    );
  },
  { immediate: true }
);

// ------------ 저장 ------------
// TiptapEditor가 defineExpose로 노출하는 inlineImages/files(Map)에 접근하기 위한 템플릿 ref
const editorRef =
  useTemplateRef<InstanceType<typeof TiptapEditor>>("editorRef");

const { setLoading } = useLoading();
const { createPost } = useCreatePost();

const savePost = async () => {
  if (!meta.value.valid) return;

  // 이미 defineField를 사용하고 있으므로, values를 사용하지 않았음
  const formData: PostInsertType = {
    title: title.value ?? "",
    menu_id: menuId.value ?? "",
    content: content.value ?? "",
    hidden: isHidden.value ?? false,
    tags: tags.value ?? [],
    thumbnail: thumbnail.value || null,
  };

  // 본문 inline 이미지(key -> File)와 첨부파일(key -> File)을 posts().create()가
  // 요구하는 Record 형태로 변환 (key는 본문의 data-inline-key와 매핑에 사용됨)
  const files: PostFile = {
    inlineImages: Object.fromEntries(editorRef.value?.inlineImages ?? []),
    attachments: Object.fromEntries(editorRef.value?.files ?? []),
  };

  setLoading(true);
  try {
    await createPost(formData, files);
    toast.success("게시글이 저장되었습니다.");
    await navigateTo("/blog/admin/posts");
  } catch (error) {
    toast.error(
      error instanceof PostgrestError
        ? error.message
        : "게시글 저장에 실패했습니다."
    );
  } finally {
    setLoading(false);
  }
};

// ------------ 임시저장 ------------
const tempPostModalOpen = ref(false);

const openTempPostModal = () => {
  tempPostModalOpen.value = true;
};

const closeTempPostModal = () => {
  tempPostModalOpen.value = false;
};
</script>
