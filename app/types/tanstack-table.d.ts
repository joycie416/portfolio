import "@tanstack/table-core";
import type { Align } from "@/types/index.js";

declare module "@tanstack/table-core" {
  interface ColumnMeta {
    classNames?: {
      header?: string;
      cell?: string;
    };
    aligns?: {
      header?: Align;
      cell?: Align;
    };
  }
}
