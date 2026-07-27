import TiptapImage, { type ImageOptions } from "@tiptap/extension-image";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import TiptapImageNodeView from "@/components/tiptap/TiptapImageNodeView.vue";

export type InlineImageOptions = ImageOptions & {
  /** 대표이미지 토글 클릭 시 호출되는 콜백 (TiptapEditor의 setThumbnail로 대체됨) */
  onToggleThumbnail: (key: string | null) => void;
};

/**
 * 본문 inline 이미지 확장.
 * - data-inline-key: inlineImages(key -> File)와 매핑해 저장 시 업로드된 URL로 치환하는 데 사용
 * - data-thumbnail: 대표이미지 여부를 문서(HTML)에도 함께 저장해, 저장된 게시글을 다시 열었을 때도 유지되게 함
 */
export const InlineImage = TiptapImage.extend<InlineImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      onToggleThumbnail: (_key: string | null) => {},
    } as InlineImageOptions;
  },
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
      "data-thumbnail": {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-thumbnail") === "true",
        renderHTML: (attributes) => {
          if (!attributes["data-thumbnail"]) return {};
          return { "data-thumbnail": "true" };
        },
      },
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(TiptapImageNodeView);
  },
});
