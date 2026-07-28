<template>
  <div>
    <Breadcrumb
      :status="breadcrumbStatus"
      :items="breadcrumbItems"
      error-message="메뉴 조회에 실패했습니다."
    />
  </div>
</template>

<script setup lang="ts">
import { Breadcrumb } from "@/components/common";

const route = useRoute();

const { breadcrumbItems, breadcrumbStatus } = useMenuBreadcrumb(
  () => route.params.slug as string
);
</script>
