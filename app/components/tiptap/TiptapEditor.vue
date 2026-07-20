<template>
  <div class="tiptap__container" :class="props.class">
    <div class="tiptap__toolbar">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="tiptap__toolbar__button">
            <Pilcrow />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="min-w-fit">
          <DropdownMenuItem
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            class="text-[1.4rem] font-semibold"
          >
            제목 1
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            class="text-[1.2rem] font-semibold"
          >
            제목 2
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            class="text-[1.1rem] font-semibold"
          >
            제목 3
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="editor?.chain().focus().setParagraph().run()"
          >
            본문
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Bold />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleItalic().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Italic />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleUnderline().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Underline />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleStrike().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Strikethrough />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Type />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="tiptap__toolbar__button">
            <Highlighter />
          </Button>
          <DropdownMenuContent align="start" class="min-w-fit flex">
            <DropdownMenuItem
              class="p-1.5"
              @click="
                editor
                  ?.chain()
                  .focus()
                  .toggleHighlight({ color: 'var(--color-highlight-yellow)' })
                  .run()
              "
            >
              <span class="bg-highlight-yellow size-4 rounded-full" />
            </DropdownMenuItem>
            <DropdownMenuItem
              class="p-1.5"
              @click="
                editor
                  ?.chain()
                  .focus()
                  .toggleHighlight({ color: 'var(--color-highlight-red)' })
                  .run()
              "
            >
              <span class="bg-highlight-red size-4 rounded-full" />
            </DropdownMenuItem>
            <DropdownMenuItem
              class="p-1.5"
              @click="
                editor
                  ?.chain()
                  .focus()
                  .toggleHighlight({ color: 'var(--color-highlight-blue)' })
                  .run()
              "
            >
              <span class="bg-highlight-blue size-4 rounded-full" />
            </DropdownMenuItem>
            <DropdownMenuItem
              class="p-1.5"
              @click="
                editor
                  ?.chain()
                  .focus()
                  .toggleHighlight({ color: 'var(--color-highlight-gray)' })
                  .run()
              "
            >
              <span class="bg-highlight-gray size-4 rounded-full" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <div class="tiptap__toolbar__divider" />

      <Button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <TextAlignStart />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('center').run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <TextAlignCenter />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('right').run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <TextAlignEnd />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('justify').run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <TextAlignJustify />
      </Button>
      <div class="tiptap__toolbar__divider" />

      <Button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <TextQuote />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleBulletList().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <List />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <ListOrdered />
      </Button>
      <div class="tiptap__toolbar__divider" />
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Minus />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleCode().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <CodeXml />
      </Button>
      <Button
        @click="openHyperlinkModal"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Link />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="tiptap__toolbar__button">
            <Table />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          class="min-w-fit grid grid-cols-5 grid-rows-2"
        >
          <DropdownMenuItem
            class="p-1.5"
            @click="
              editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
            "
          >
            <Grid2X2Plus title="테이블 추가" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().addColumnAfter().run()"
          >
            <BetweenVerticalStart title="행 추가" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().addRowAfter().run()"
          >
            <BetweenHorizontalStart title="열 추가" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().deleteColumn().run()"
          >
            <TableColumnsSplit title="열 제거" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().deleteRow().run()"
          >
            <TableRowsSplit title="행 제거" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().mergeCells().run()"
          >
            <TableCellsMerge title="셀 병합" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().splitCell().run()"
          >
            <TableCellsSplit title="셀 분할" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().toggleHeaderRow().run()"
          >
            <Sheet title="행 헤더" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().toggleHeaderColumn().run()"
          >
            <Sheet title="열 헤더" class="rotate-270" />
          </DropdownMenuItem>
          <DropdownMenuItem
            class="p-1.5"
            @click="editor?.chain().focus().deleteTable().run()"
          >
            <Grid2X2X title="테이블 제거" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        @click="openImagePicker"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Image />
      </Button>
      <Button
        @click="openFilePicker"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Paperclip />
      </Button>
      <input
        ref="imageInputRef"
        type="file"
        :accept="INLINE_IMAGE_ACCEPT"
        multiple
        class="hidden"
        @change="onImageInputChange"
      />
      <input
        ref="fileInputRef"
        type="file"
        multiple
        class="hidden"
        @change="onFileInputChange"
      />
    </div>
    <editor-content :editor="editor" class="tiptap__editor" />
    <div v-if="attachmentList.length" class="tiptap__attachments">
      <FileItem
        v-for="attachment in attachmentList"
        :key="attachment.key"
        :file="attachment.file"
        @remove="removeAttachment(attachment.key)"
      />
    </div>
  </div>
  <TiptapHyperlinkModal
    v-if="editor"
    :editor="editor"
    :open="hyperlinkModalOpen"
    @close="hyperlinkModalOpen = false"
    @update:set-link="setLink"
  />
</template>

<script lang="ts" setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import FileHandler from "@tiptap/extension-file-handler";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import {
  BetweenHorizontalStart,
  BetweenVerticalStart,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Highlighter,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextQuote,
  List,
  ListOrdered,
  Minus,
  Link,
  Paperclip,
  Image,
  Table,
  Pilcrow,
  CodeXml,
  TableColumnsSplit,
  TableRowsSplit,
  TableCellsMerge,
  TableCellsSplit,
  Sheet,
  Grid2X2Plus,
  Grid2X2X,
} from "@lucide/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "vue-sonner";
import { TiptapHyperlinkModal } from ".";
import { InlineImage } from "./extensions";
import { FileItem } from "@/components/common";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const model = defineModel<string | undefined>();
// 대표이미지로 지정된 inline 이미지의 key (없으면 null). 부모 폼의 thumbnail 필드와 동기화된다.
const thumbnailKey = defineModel<string | null>("thumbnail", {
  default: null,
});

// 폼 리셋/수정 모드 등 외부에서 값이 바뀌면 에디터에 반영한다.
// (emitUpdate: false로 onUpdate 재호출에 의한 무한 루프를 방지)
watch(
  () => model.value,
  (value) => {
    const current = editor.value;
    if (!current) return;

    const next = value ?? "";
    if (current.getHTML() === next) return;
    if (current.isEmpty && next === "") return;

    current.commands.setContent(next, { emitUpdate: false });
  }
);

// ------------ 파일 ------------

// inline 이미지로 허용하는 확장자/타입 (첨부파일은 제한 없음)
const INLINE_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
] as const;
const INLINE_IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif";

// 파일 업로드 관리
// 게시글 내 이미지
const inlineImages = ref<Map<string, File>>(new Map());
// 첨부 파일
const files = ref<Map<string, File>>(new Map());
const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const MAX_FULL_ATTACHMENT_SIZE = 1024 * 1024 * 50; // 50MB

// inline 이미지로 삽입 가능한 타입인지 판별 (jpg/jpeg/png/gif만)
const isInlineInsertable = (file: File): boolean =>
  (INLINE_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);

// 파일명 확장자를 추출한다 (없으면 빈 문자열)
const getFileExtension = (filename: string): string => {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex === -1 ? "" : filename.slice(dotIndex);
};

// 파일을 지정한 맵에 등록하고 매핑에 사용할 key를 반환
// 동일 파일(이름/크기/수정시각)은 기존 key를 재사용해 중복 저장을 방지
// key는 원본 파일명이 아닌 UUID로 생성: 원본 파일명 사용시 비-ASCII 문자 오류 발생 방지
const registerFileInMap = (target: Map<string, File>, file: File): string => {
  for (const [existingKey, storedFile] of target) {
    if (
      storedFile.name === file.name &&
      storedFile.size === file.size &&
      storedFile.lastModified === file.lastModified
    ) {
      return existingKey;
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("각 파일은 최대 10MB까지 업로드 가능합니다.");
    return "";
  }

  const totalSize = Array.from(target.values()).reduce(
    (acc, file) => acc + file.size,
    0
  );
  if (totalSize + file.size > MAX_FULL_ATTACHMENT_SIZE) {
    toast.error("첨부파일은 게시글 당 최대 50MB까지 업로드 가능합니다.");
    return "";
  }

  const key = `${crypto.randomUUID()}${getFileExtension(file.name)}`;
  target.set(key, file);
  return key;
};

// 붙여넣은 이미지를 inlineImages에 등록하고, 본문 이미지와 매핑할 key를 반환
const registerInlineImage = (file: File): string =>
  registerFileInMap(inlineImages.value, file);

// 첨부파일을 files 맵에 등록하고 매핑에 사용할 key를 반환
const registerFile = (file: File): string =>
  registerFileInMap(files.value, file);

// 이미지: base64로 읽어 inline 이미지 노드로 삽입
const insertInlineImage = (targetEditor: Editor, file: File) => {
  const key = registerInlineImage(file);
  const fileReader = new FileReader();

  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    targetEditor
      .chain()
      .insertContentAt(targetEditor.state.selection.anchor, {
        type: "image",
        attrs: {
          src: fileReader.result,
          "data-inline-key": key,
        },
      })
      .focus()
      .run();
  };
};

// 첨부파일: 본문에 넣지 않고 files 맵에만 등록 (별도 목록으로 표시)
const addAttachment = (file: File): void => {
  registerFile(file);
  // ref 내부 Map 변경을 반응형으로 반영하기 위해 재할당
  files.value = new Map(files.value);
};

// 첨부파일 목록 (템플릿에서 FileItem으로 렌더)
const attachmentList = computed(() =>
  Array.from(files.value, ([key, file]) => ({ key, file }))
);

const removeAttachment = (key: string) => {
  files.value.delete(key);
  files.value = new Map(files.value);
};

// 붙여넣기/드롭: 허용 이미지(jpg/jpeg/png/gif)만 inline 삽입, 그 외 파일은 무시
const onFilePaste = (
  editor: Editor,
  pastedFiles: File[],
  _pasteContent?: string | undefined
) => {
  pastedFiles.forEach((file) => {
    if (isInlineInsertable(file)) insertInlineImage(editor, file);
  });
};

const onFileDrop = (editor: Editor, droppedFiles: File[], _pos: number) => {
  droppedFiles.forEach((file) => {
    if (isInlineInsertable(file)) insertInlineImage(editor, file);
  });
};

// 툴바 이미지 버튼: 선택한 파일을 inline 이미지로 저장
const imageInputRef = ref<HTMLInputElement | null>(null);

const openImagePicker = () => {
  imageInputRef.value?.click();
};

const onImageInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !editor.value) return;

  Array.from(input.files).forEach((file) => {
    // 이미지 버튼은 jpg/jpeg/png/gif만 허용
    if (!isInlineInsertable(file)) {
      toast.error(
        `${file.name}은(는) 지원하지 않는 이미지 형식입니다. (jpg, jpeg, png, gif만 가능)`
      );
      return;
    }
    insertInlineImage(editor.value as Editor, file);
  });

  // 동일 파일을 다시 선택해도 change가 발생하도록 초기화
  input.value = "";
};

// 툴바 클립 버튼: 선택한 파일을 첨부파일로 저장
const fileInputRef = ref<HTMLInputElement | null>(null);

const openFilePicker = () => {
  fileInputRef.value?.click();
};

const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  Array.from(input.files).forEach((file) => {
    addAttachment(file);
  });

  // 동일 파일을 다시 선택해도 change가 발생하도록 초기화
  input.value = "";
};

// ------------ 썸네일 ------------
// 문서 내 이미지 노드의 data-thumbnail 사용
// key가 있으면 해당 이미지만 켜고 나머지는 모두 끄며, key가 null이면 전부 끔
const setThumbnail = (key: string | null) => {
  const currentEditor = editor.value;
  if (!currentEditor) return;

  currentEditor
    .chain()
    .command(({ tr }) => {
      currentEditor.state.doc.descendants((node, pos) => {
        if (node.type.name !== "image") return;

        const nodeKey =
          (node.attrs["data-inline-key"] as string | null) ?? null;
        const shouldBeThumbnail = key !== null && nodeKey === key;
        if (Boolean(node.attrs["data-thumbnail"]) === shouldBeThumbnail) return;

        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          "data-thumbnail": shouldBeThumbnail,
        });
      });
      return true;
    })
    .run();

  thumbnailKey.value = key;
};

// ------------ 에디터 ------------
const editor = useEditor({
  content: model.value,
  extensions: [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
      },
      orderedList: {
        keepMarks: true,
      },
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Blockquote,
    // CodeBlockLowlight,
    FileHandler.configure({
      // 붙여넣기/드롭은 inline 이미지(jpg/jpeg/png/gif)만 허용
      allowedMimeTypes: [...INLINE_IMAGE_MIME_TYPES],
      onPaste: onFilePaste,
      onDrop: onFileDrop,
    }),
    Highlight.configure({
      multicolor: true,
    }),
    InlineImage.configure({
      onToggleThumbnail: setThumbnail,
      resize: {
        enabled: true,
        minWidth: 100,
        minHeight: 100,
        alwaysPreserveAspectRatio: true,
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyleKit,
    TableKit.configure({
      table: { resizable: true },
    }),
  ],
  onCreate: ({ editor: createdEditor }) => {
    // 기존 콘텐츠(수정 모드 등)에 이미 썸네일이 표시돼 있으면 그 값을 초기값으로 사용
    createdEditor.state.doc.descendants((node) => {
      if (node.type.name === "image" && node.attrs["data-thumbnail"]) {
        thumbnailKey.value =
          (node.attrs["data-inline-key"] as string | null) ?? null;
      }
    });
  },
  onUpdate: ({ editor: updatedEditor }) => {
    // 내용이 없을 때 Tiptap은 `<p></p>`를 반환하므로,
    // 폼 검증(min(1))이 동작하도록 빈 값은 빈 문자열로 정규화한다.
    model.value = updatedEditor.isEmpty ? "" : updatedEditor.getHTML();

    // 썸네일로 지정된 이미지가 본문에서 삭제된 경우
    // 썸네일 정보도 함께 제거
    if (thumbnailKey.value) {
      let stillExists = false;
      updatedEditor.state.doc.descendants((node) => {
        if (
          node.type.name === "image" &&
          node.attrs["data-inline-key"] === thumbnailKey.value
        ) {
          stillExists = true;
        }
      });
      if (!stillExists) thumbnailKey.value = null;
    }
  },
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// 저장 시 사용할 데이터/헬퍼를 부모에 노출
// - files: 첨부파일(key -> File). 본문과 분리되어 별도 목록으로 관리되므로 개별 업로드 후 저장
// - inlineImages: 본문 이미지(key -> File). 본문에는 key만 저장되므로 업로드 후 src 치환에 사용
defineExpose({
  files,
  inlineImages,
  getHTML: () => editor.value?.getHTML() ?? "",
  /**
   * key -> URL 매핑으로 본문 inline 이미지의 src를 실제 URL로 치환한다.
   * 이미지 업로드가 끝난 뒤 저장 직전에 호출한다.
   * (첨부파일은 본문에 없으므로 files 맵을 별도로 업로드해 저장한다.)
   */
  applyUploadedUrls: (urlByKey: Record<string, string>) => {
    const current = editor.value;
    if (!current) return "";

    current.state.doc.descendants((node, pos) => {
      if (node.type.name === "image") {
        const key = node.attrs["data-inline-key"] as string | null;
        if (key && urlByKey[key]) {
          current
            .chain()
            .command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                src: urlByKey[key],
              });
              return true;
            })
            .run();
        }
      }
    });

    return editor.value?.getHTML() ?? "";
  },
});

// ------------ 하이퍼링크 ------------
const hyperlinkModalOpen = ref(false);

const openHyperlinkModal = () => {
  hyperlinkModalOpen.value = true;
};

const setLink = (url: string) => {
  editor.value?.chain().focus().setLink({ href: url }).run();
  hyperlinkModalOpen.value = false;
};

// ------------ 테이블 ------------
</script>

<style lang="scss">
.tiptap {
  flex: 1;
  padding: 8px;
  min-height: 400px;
  max-height: 800px;

  &:focus,
  &:focus-visible {
    outline: none;
  }

  &__editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
  }

  &__container {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
  }

  &__attachments {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border-top: 1px solid var(--color-gray-02);
    background-color: white;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    background-color: var(--color-gray-01);
  }

  &__toolbar__button {
    width: 28px;
    height: 28px;
    padding: 4px;

    &:hover {
      background-color: var(--color-gray-02);
    }
  }

  &__toolbar__divider {
    width: 1px;
    height: 20px;
    background-color: var(--color-gray-02);
    margin-inline: 4px;
  }

  h1,
  h2,
  h3 {
    line-height: 1.1;
    text-wrap: pretty;
    font-weight: 600;
  }

  h1,
  h2 {
    margin-top: 3.3rem;
    margin-bottom: 1.2rem;
  }

  h3 {
    margin-top: 2.5rem;
    margin-bottom: 1.2rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  ol,
  ul {
    padding-left: 1.5rem;
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  code {
    background-color: var(--color-gray-02);
    border-radius: 0.4rem;
    color: var(--color-red-04);
    padding: 0.25em 0.3em;
  }

  a {
    color: var(--color-primary-600);
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      color: var(--color-primary-700);
    }
  }

  blockquote {
    border-left: 3px solid var(--color-gray-04);
    margin: 1.5rem 0 1.5rem 1rem;
    padding-left: 1rem;
  }

  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid var(--color-gray-03);
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: var(--color-gray-01);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: var(--color-gray-02);
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: var(--color-primary-600);
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
    }
  }

  .tableWrapper {
    margin: 1.5rem 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}
</style>
