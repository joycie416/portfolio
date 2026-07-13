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
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Image />
      </Button>
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="ghost"
        class="tiptap__toolbar__button"
      >
        <Paperclip />
      </Button>
    </div>
    <editor-content :editor="editor" class="tiptap__editor" />
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
import { Button } from "@/components/ui/button";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
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
import { TiptapHyperlinkModal } from ".";

const model = defineModel({
  type: String,
  required: true,
});

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
    Highlight.configure({
      multicolor: true,
    }),
    TiptapImage,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyleKit,
    TableKit,
  ],
});

onBeforeUnmount(() => {
  editor.value?.destroy();
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

  blockquote {
    border-left: 3px solid var(--color-gray-04);
    margin: 1.5rem 0 1.5rem 1rem;
    padding-left: 1rem;
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
}
</style>
