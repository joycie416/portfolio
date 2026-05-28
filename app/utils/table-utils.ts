import type { Align } from "~/types";

export const getAlignClassName = (align?: Align) => {
  if (align === "left") return "text-left";
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return undefined;
};
