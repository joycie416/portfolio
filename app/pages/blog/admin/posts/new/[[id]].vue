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
      :existing-attachments="existingAttachments"
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
      <Button
        v-if="editTarget?.temp || !editTarget"
        type="button"
        variant="outline"
        class="w-full gap-0"
        @click="saveTempPost"
      >
        임시저장
        <span class="w-px h-4 ml-3 mr-2 bg-text-gray-01" />
        <span
          class="px-1 hover:text-primary-600"
          @click.stop="openTempPostModal"
        >
          {{ tempPostCount.toLocaleString() }}
        </span>
      </Button>
      <Button
        type="button"
        :disabled="!meta.valid"
        :class="{
          'w-full': !editTarget || editTarget?.temp,
          'w-full md:w-1/2 md:mx-auto': editTarget && !editTarget?.temp,
        }"
        @click="savePost"
      >
        등록
      </Button>
    </div>
  </div>
  <TempPostModal
    :open="tempPostModalOpen"
    @close="closeTempPostModal"
    @resetForm="resetForm"
  />
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "vue-sonner";
import { Checkbox, InputGroup } from "@/components/common";
import { postSchema } from "@/schemas/post";
import type { InputGroupState } from "@/types/input-group";
import type {
  PostFile,
  PostInsertType,
  PostStorageFile,
  PostUpdateFile,
  PostUpdateType,
} from "@/types/supabase";
import { TiptapEditor } from "@/components/tiptap";
import { Button } from "~/components/ui/button";
import { X } from "@lucide/vue";
import TempPostModal from "@/components/features/post/TempPostModal.vue";

definePageMeta({
  middleware: "validate-post",
});

const route = useRoute();
const router = useRouter();

// ------------ 폼 ------------
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

const resetForm = () => {
  const defaultMenu = menuOptions.value.find(
    (option) => option.label === "미분류"
  );
  setValues({
    title: "",
    menuId: defaultMenu?.value ?? menuOptions.value[0]?.value ?? "",
    content: "",
    hidden: false,
    tags: [],
    thumbnail: null,
  });
  existingAttachments.value = [];
  editorRef.value?.clearPendingFiles();
};

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

// TiptapEditor가 defineExpose로 노출하는 inlineImages/files(Map)에 접근하기 위한 템플릿 ref
const editorRef =
  useTemplateRef<InstanceType<typeof TiptapEditor>>("editorRef");

// 이미 스토리지에 올라간 첨부파일 (임시저장 이후/수정 시)
const existingAttachments = ref<PostStorageFile[]>([]);

const { setLoading } = useLoading();
const { createPost } = useCreatePost();
const { updatePost } = useUpdatePost();
const { publishTempPost } = usePublishTempPost();

// ------------ 임시저장 ------------
// 임시저장 성공 후: 본문/첨부 상태를 저장 결과에 맞추고 pending File 맵을 비움
const syncAfterTempSave = (saved: {
  content: string;
  thumbnail: string | null;
  attachments: PostStorageFile[];
}) => {
  setValues(
    {
      content: saved.content,
      thumbnail: saved.thumbnail,
    },
    false
  );
  existingAttachments.value = saved.attachments;
  editorRef.value?.clearPendingFiles();
};

const saveTempPost = async () => {
  const tempPostId = route.query.temp;

  // 최초 임시 저장인 경우
  if (!tempPostId) {
    if (!meta.value.valid) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    const formData: PostInsertType = {
      title: title.value ?? "",
      menu_id: menuId.value ?? "",
      content: content.value ?? "",
      hidden: isHidden.value ?? false,
      tags: tags.value ?? [],
      thumbnail: thumbnail.value || null,
    };

    const files: PostFile = {
      inlineImages: Object.fromEntries(editorRef.value?.inlineImages ?? []),
      attachments: Object.fromEntries(editorRef.value?.files ?? []),
    };

    try {
      const saved = await createPost(formData, files, true);
      syncAfterTempSave(saved);
      toast.success("임시저장되었습니다.");
      await refreshNuxtData(TEMP_POST_LIST_KEY);
      router.replace({ query: { temp: saved.id } });
    } catch (error) {
      toast.error(
        error instanceof PostgrestError
          ? error.message
          : "임시저장에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  } else {
    // 이미 저장된 임시 게시글의 경우
    setLoading(true);

    const formData: PostUpdateType = {
      id: Number(tempPostId),
      title: title.value ?? "",
      menu_id: menuId.value ?? "",
      content: content.value ?? "",
      hidden: isHidden.value ?? false,
      tags: tags.value ?? [],
      thumbnail: thumbnail.value || null,
    };

    const files: PostUpdateFile = {
      inlineImages: Object.fromEntries(editorRef.value?.inlineImages ?? []),
      attachments: Object.fromEntries(editorRef.value?.files ?? []),
      removedAttachmentKeys: [
        ...(editorRef.value?.removedAttachmentKeys ?? []),
      ],
    };

    try {
      const saved = await updatePost(formData, files, true);
      syncAfterTempSave(saved);
      toast.success("임시저장되었습니다.");
      await refreshNuxtData(TEMP_POST_LIST_KEY);
    } catch (error) {
      toast.error(
        error instanceof PostgrestError
          ? error.message
          : "임시저장에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }
};

// ------------ 임시저장 모달 ------------
const tempPostModalOpen = ref(false);

const openTempPostModal = () => {
  tempPostModalOpen.value = true;
};

const closeTempPostModal = () => {
  tempPostModalOpen.value = false;
};

// ------------ 임시저장 목록 개수 ------------
const { data: tempPostData } = useGetTempPosts();
const tempPostCount = computed(() => tempPostData.value?.count ?? 0);

// ------------ 글 불러오기 ------------
// create면 null, 등록글 수정이면 temp:false, 임시저장 이어서면 temp:true
const parseRouteId = (raw: unknown): number | null => {
  if (raw == null || Array.isArray(raw) || raw === "") return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) ? n : null;
};

const editTarget = computed(() => {
  const id = parseRouteId(route.params.id);
  if (id != null) return { id, temp: false } as const;

  const tempId = parseRouteId(route.query.temp);
  if (tempId != null) return { id: tempId, temp: true } as const;

  return null;
});

const { data: postData, execute: loadPost } = useGetPost({
  // .value 스냅샷이 아니라 getter로 넘겨야 route 변경에 반응함
  id: () => editTarget.value?.id ?? null,
  temp: () => editTarget.value?.temp ?? false,
  immediate: false,
});

watch(
  editTarget,
  async (target) => {
    if (!target) return;

    await loadPost();

    const loaded = postData.value;
    if (!loaded) return;

    setValues(
      {
        title: loaded.post.title,
        menuId: loaded.post.menu_id,
        content: loaded.post.content,
        hidden: loaded.post.hidden,
        tags: loaded.post.tags ?? [],
        thumbnail: loaded.post.thumbnail,
      },
      false
    );
    existingAttachments.value = loaded.files.attachments;
  },
  { immediate: true }
);

// ------------ 저장 ------------
const savePost = async () => {
  if (!meta.value.valid) return;

  setLoading(true);

  // 이미 defineField를 사용하고 있으므로, values를 사용하지 않았음
  const formData = {
    title: title.value ?? "",
    menu_id: menuId.value ?? "",
    content: content.value ?? "",
    hidden: isHidden.value ?? false,
    tags: tags.value ?? [],
    thumbnail: thumbnail.value || null,
  };

  // 본문 inline 이미지/첨부파일 (key는 본문 data-inline-key와 매핑)
  const pendingFiles: PostFile = {
    inlineImages: Object.fromEntries(editorRef.value?.inlineImages ?? []),
    attachments: Object.fromEntries(editorRef.value?.files ?? []),
  };
  // 수정·임시글 발행 시: 새로 추가된 파일 + 삭제한 기존 첨부 key
  const updateFiles: PostUpdateFile = {
    ...pendingFiles,
    removedAttachmentKeys: [...(editorRef.value?.removedAttachmentKeys ?? [])],
  };

  try {
    if (editTarget.value && !editTarget.value.temp) {
      // 등록글 수정
      await updatePost(
        { id: editTarget.value.id, ...formData },
        updateFiles,
        false
      );
    } else if (editTarget.value?.temp) {
      // 임시저장 글 등록: posts에 새로 저장한 뒤 temp_posts 삭제
      await publishTempPost(editTarget.value.id, formData, updateFiles);
      await refreshNuxtData(TEMP_POST_LIST_KEY);
    } else {
      // 새 글 등록
      await createPost(formData, pendingFiles);
    }

    toast.success("게시글이 저장되었습니다.");
    allowLeave.value = true;
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

// ---------- 페이지 이동 전 경고 ----------
// 저장 성공 후 navigateTo 시 confirm을 건너뛰기 위한 플래그
const allowLeave = ref(false);

onBeforeRouteLeave(() => {
  if (allowLeave.value) return;
  const isConfirmed = confirm(
    "저장되지 않은 내용이 있습니다. 정말 나가시겠습니까?"
  );
  // false를 반환해야 진행 중인 네비게이션이 취소됨
  if (!isConfirmed) return false;
});

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (allowLeave.value) return;
  // beforeunload에서는 confirm 사용 불가
  // preventDefault만 하면 기본 이탈 경고 띄움
  e.preventDefault();
};

onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload);
});
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload);
});
</script>
