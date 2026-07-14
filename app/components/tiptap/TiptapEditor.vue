<template>
  <div class="tiptap__container">
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

      <!-- TODO: 링크 입력 창 추가 -->
      <Button
        @click="openHyperlinkModal"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Link />
      </Button>
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Table />
      </Button>
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
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import {
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
} from "@lucide/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "vue-sonner";
import { TiptapHyperlinkModal } from ".";
import { FileItem } from "@/components/common";

const model = defineModel({
  type: String,
  required: true,
});

// inline 이미지로 허용하는 확장자/타입 (첨부파일은 제한 없음)
const INLINE_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
] as const;
const INLINE_IMAGE_ACCEPT = ".jpg,.jpeg,.png,.gif";

// inlineImages의 key를 본문 이미지 노드(HTML)에 보존해 저장 시 매핑에 사용
const InlineImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-inline-key": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-inline-key"),
        renderHTML: (attributes) => {
          if (!attributes["data-inline-key"]) return {};
          return { "data-inline-key": attributes["data-inline-key"] };
        },
      },
    };
  },
});

// 파일 업로드 관리
// 게시글 내 이미지
const inlineImages = ref<Map<string, File>>(new Map());
// 첨부 파일
const files = ref<Map<string, File>>(new Map());

// inline 이미지로 허용되는 타입인지 판별 (jpg/jpeg/png/gif만)
const isInlineImageFile = (file: File): boolean =>
  (INLINE_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);

// 파일을 지정한 맵에 등록하고 매핑에 사용할 key를 반환한다.
// 동일 파일(이름/크기/수정시각)은 기존 key를 재사용해 중복 저장을 방지하고,
// 이름이 겹치면 접미사를 붙여 충돌을 피한다.
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

  let key = file.name;
  let counter = 1;
  while (target.has(key)) {
    const dotIndex = file.name.lastIndexOf(".");
    key =
      dotIndex === -1
        ? `${file.name}-${counter}`
        : `${file.name.slice(0, dotIndex)}-${counter}${file.name.slice(dotIndex)}`;
    counter += 1;
  }

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
const addAttachment = (file: File) => {
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
    if (isInlineImageFile(file)) insertInlineImage(editor, file);
  });
};

const onFileDrop = (editor: Editor, droppedFiles: File[], _pos: number) => {
  droppedFiles.forEach((file) => {
    if (isInlineImageFile(file)) insertInlineImage(editor, file);
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
    if (!isInlineImageFile(file)) {
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
    InlineImage,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyleKit,
    TableKit,
  ],
  onUpdate: ({ editor: updatedEditor }) => {
    model.value = updatedEditor.getHTML();
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

const hyperlinkModalOpen = ref(false);

const openHyperlinkModal = () => {
  hyperlinkModalOpen.value = true;
};

const setLink = (url: string) => {
  editor.value?.chain().focus().setLink({ href: url }).run();
  hyperlinkModalOpen.value = false;
};
</script>

<style lang="scss">
.tiptap {
  flex: 1;
  padding: 8px;
  min-height: 400px;

  &:focus,
  &:focus-visible {
    outline: none;
  }
  
  &__editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }

  &__container {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid var(--color-gray-03);
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
}
</style>
