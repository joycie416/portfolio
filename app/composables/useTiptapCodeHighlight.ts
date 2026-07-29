import { highlightCodeBlocks } from "@/utils/tiptap/highlight-code-blocks";

export const useTiptapCodeHighlight = (
  containerRef: Ref<HTMLElement | null>,
  content: Ref<string | undefined | null>
) => {
  const applyHighlight = async () => {
    if (!import.meta.client || !containerRef.value || !content.value) return;

    await nextTick();
    highlightCodeBlocks(containerRef.value);
  };

  watch(content, applyHighlight, { flush: "post" });
  onMounted(applyHighlight);
};
