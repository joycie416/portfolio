<template>
  <Dialog :open="open" title="링크 삽입">
    <InputGroup
      type="text"
      label="URL"
      v-model="url"
      placeholder="https://www.example.com"
    />
    <template #footer>
      <Button variant="outline" @click="close">취소</Button>
      <Button @click="save">확인</Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Editor } from "@tiptap/vue-3";
import { Dialog, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  editor?: Editor;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:set-link", value: string): void;
  (e: "close"): void;
}>();

const url = ref("");

const save = () => {
  emit("update:set-link", url.value);
  close();
};

const close = () => {
  emit("close");
  url.value = "";
};
</script>
