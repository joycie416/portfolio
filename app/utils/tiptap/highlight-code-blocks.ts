import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

type HastNode = {
  type?: string;
  value?: string;
  children?: HastNode[];
  properties?: { className?: string[] };
};

const parseNodes = (
  nodes: HastNode[],
  className: string[] = []
): { text: string; classes: string[] }[] =>
  nodes.flatMap((node) => {
    const classes = [
      ...className,
      ...(node.properties?.className ?? []),
    ];

    if (node.children?.length) {
      return parseNodes(node.children, classes);
    }

    return [{ text: node.value ?? "", classes }];
  });

const getHighlightNodes = (result: HastNode | { children?: HastNode[]; value?: HastNode[] }) =>
  result.children ?? result.value ?? [];

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const nodesToHtml = (nodes: { text: string; classes: string[] }[]) =>
  nodes
    .map(({ text, classes }) => {
      const escaped = escapeHtml(text);
      if (!classes.length) return escaped;
      return `<span class="${classes.join(" ")}">${escaped}</span>`;
    })
    .join("");

const getLanguage = (codeEl: HTMLElement): string | null => {
  const match = codeEl.className.match(/language-([\w-]+)/);
  return match?.[1] ?? null;
};

const highlightCode = (codeEl: HTMLElement) => {
  const source = codeEl.textContent ?? "";
  if (!source.trim()) return;

  const language = getLanguage(codeEl);

  try {
    const tree =
      language && lowlight.registered(language)
        ? lowlight.highlight(language, source)
        : lowlight.highlightAuto(source);

    codeEl.innerHTML = nodesToHtml(parseNodes(getHighlightNodes(tree)));
    codeEl.classList.add("hljs");
  } catch {
    // language alias 미등록 등: plain text 유지
  }
};

/** v-html로 렌더된 Tiptap 본문의 code block에 lowlight 하이라이팅을 적용한다. */
export const highlightCodeBlocks = (root: ParentNode) => {
  root.querySelectorAll("pre code").forEach((codeEl) => {
    if (codeEl instanceof HTMLElement) highlightCode(codeEl);
  });
};
