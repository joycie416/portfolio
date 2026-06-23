<template><div>메뉴 수정</div></template>

<script setup lang="ts">
import type { Menu } from "@/types/supabase";

defineProps<{ menu: Menu | null }>();
</script>
