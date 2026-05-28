import type { ColumnDef } from "@tanstack/vue-table";

export type Columns<TData, TValue = unknown> = ColumnDef<TData, TValue>[];

export { default as DataTable } from "./DataTable.vue";
