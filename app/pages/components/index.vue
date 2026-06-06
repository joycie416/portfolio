<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-3">
      <h2>버튼</h2>
      <div class="space-y-1">
        <h3>variant</h3>
        <div class="flex gap-2">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      <div class="space-y-1">
        <h3>size</h3>
        <div class="flex gap-2">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="sm" variant="destructive">Small</Button>
          <Button variant="destructive">Default</Button>
          <Button size="lg" variant="destructive">Large</Button>
        </div>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary">Small</Button>
          <Button variant="secondary">Default</Button>
          <Button size="lg" variant="secondary">Large</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button variant="outline">Outline</Button>
          <Button size="lg" variant="outline">Outline</Button>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2>테이블</h2>
      <DataTable table-id="test-table" :data="sampleData" :columns="columns" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DataTable, type Columns } from "@/components/ui/data-table";

type SampleDataType = {
  id: string;
  title: string;
  createdAt: string;
};

const sampleData: SampleDataType[] = [
  {
    id: "1234",
    title: "임시 제목입니다.",
    createdAt: new Date().toLocaleDateString("ko-KR"),
  },
  {
    id: "1235",
    title: "임시 제목입니다.임시 제목입니다.임시 제목입니다.",
    createdAt: new Date().toLocaleDateString("ko-KR"),
  },
  {
    id: "1236",
    title: "임시 제목입니다.임시 제목입니다.",
    createdAt: new Date().toLocaleDateString("ko-KR"),
  },
  {
    id: "1237",
    title: "임시 제목입니다.asddddddddddddddddddddddddddddddd",
    createdAt: new Date().toLocaleDateString("ko-KR"),
  },
];

const columns = computed<Columns<SampleDataType>>(() => [
  {
    accessorKey: "select",
    header: ({ table }) => {
      return h("input", {
        type: "checkbox",
        checked: table.getIsAllRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
      });
    },
    cell: ({ row }) => {
      return h("input", {
        type: "checkbox",
        checked: row.getIsSelected(),
        onChange: row.getToggleSelectedHandler(),
      });
    },
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => h("div", null, row.original.id),
    meta: {
      classNames: { cell: "bg-red" },
      aligns: {
        header: "center",
      },
    },
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => h("div", null, row.original.title),
    meta: {
      aligns: {
        header: "center",
        cell: "right",
      },
    },
  },
  {
    accessorKey: "createdAt",
    header: "작성일자",
    cell: ({ row }) => h("div", null, row.original.createdAt),
  },
]);
</script>
