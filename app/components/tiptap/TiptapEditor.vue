<template>
  <div class="tiptap__container">
    <div class="tiptap__toolbar">
      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('bold') }"
      >
        <Pilcrow />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('bold') }"
      >
        <Bold />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleItalic().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('italic') }"
      >
        <Italic />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleUnderline().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('underline') }"
      >
        <Underline />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleStrike().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('strike') }"
      >
        <Strikethrough />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Type />
      </Button>

      <Button
        @click="editor?.chain().focus().toggleBold().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Highlighter />
      </Button>
      <div class="tiptap__toolbar__divider" />

      <Button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('textAlign', 'left') }"
      >
        <TextAlignStart />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('center').run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('textAlign', 'center') }"
      >
        <TextAlignCenter />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('right').run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('textAlign', 'right') }"
      >
        <TextAlignEnd />
      </Button>
      <Button
        @click="editor?.chain().focus().setTextAlign('justify').run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('textAlign', 'justify') }"
      >
        <TextAlignJustify />
      </Button>
      <div class="tiptap__toolbar__divider" />

      <Button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('blockquote') }"
      >
        <TextQuote />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleBulletList().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('bulletList') }"
      >
        <List />
      </Button>
      <Button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        variant="icon"
        class="tiptap__toolbar__button"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
      >
        <ListOrdered />
      </Button>
      <div class="tiptap__toolbar__divider" />
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Minus />
      </Button>
      <!-- TODO: 링크 입력 창 추가 -->
      <Button
        @click="
          editor
            ?.chain()
            .focus()
            .setLink({ href: 'https://www.google.com' })
            .run()
        "
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Link />
      </Button>
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Table />
      </Button>
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Image />
      </Button>
      <Button
        @click="editor?.chain().focus().setHorizontalRule().run()"
        variant="icon"
        class="tiptap__toolbar__button"
      >
        <Paperclip />
      </Button>
    </div>
    <editor-content :editor="editor" class="tiptap__editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { Button } from "@/components/ui/button";
import StarterKit from "@tiptap/starter-kit";
import Blockquote from "@tiptap/extension-blockquote";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
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
} from "@lucide/vue";

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
    }),
    Blockquote,
    // CodeBlockLowlight,
    TiptapImage,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyleKit,
    TableKit,
  ],
  // Don't render on the server, only on the client after hydration
  immediatelyRender: false,
  // onUpdate: ({ editor }) => {
  //   model.value = editor.getHTML();
  // },
});
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
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
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
}
</style>
