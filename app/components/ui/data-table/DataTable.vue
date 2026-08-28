<script setup lang="ts" generic="TData, TValue">
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import type { Columns } from ".";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empty } from "@/components/common";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  tableId: string;
  columns: Columns<TData, TValue>;
  data: TData[];
  status?: "loading" | "success" | "error";
  loadingRows?: number;
  classNames?: {
    tableContainer?: HTMLDivElement["className"];
    tableHeader?: HTMLTableSectionElement["className"];
    emptyRow?: HTMLTableCellElement["className"];
  };
}

const props = withDefaults(defineProps<Props>(), {
  status: "success",
  loadingRows: 3,
  classNames: () => ({}),
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  enableMultiRowSelection: true,
});
</script>

<template>
  <div :class="cn(classNames?.tableContainer)">
    <Table class="bg-transparent table-fixed">
      <TableHeader :class="cn(classNames?.tableHeader)">
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="
              cn(
                'h-8 border-b border-b-gray-04',
                getAlignClassName(header.column.columnDef.meta?.aligns?.header),
                header.column.columnDef.meta?.classNames?.header
              )
            "
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template
          v-if="status === 'success' && table.getRowModel().rows?.length"
        >
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            class="border-b-gray-02"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="
                cn(
                  getAlignClassName(cell.column.columnDef.meta?.aligns?.cell),
                  cell.column.columnDef.meta?.classNames?.cell
                )
              "
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template
          v-else-if="status === 'success' && !table.getRowModel().rows?.length"
        >
          <TableRow>
            <TableCell
              :colspan="columns.length"
              :class="cn(classNames?.emptyRow)"
            >
              <Empty message="데이터가 없습니다." />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="status === 'error'">
          <TableRow>
            <TableCell
              :colspan="columns.length"
              :class="cn(classNames?.emptyRow)"
            >
              <Empty message="오류가 발생했습니다." />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="status === 'loading'">
          <TableRow v-for="i in loadingRows || 4" :key="i" class="border-b-0">
            <TableCell v-for="j in columns.length" :key="j" class="px-1.5 py-1">
              <Skeleton class="w-full h-7" />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
