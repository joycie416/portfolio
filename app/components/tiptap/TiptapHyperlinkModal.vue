<template>
  <Dialog :open="props.open" title="링크 삽입">
    <InputGroup
      v-model="url"
      type="text"
      label="URL"
      placeholder="https://www.example.com"
    />
    <template #footer>
      <Button variant="outline" @click="close">취소</Button>
      <Button @click="save">확인</Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Dialog, InputGroup } from "@/components/common";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  setLink: [value: string];
  close: [];
}>();

const url = ref("");

const save = () => {
  emit("setLink", url.value);
  close();
};

const close = () => {
  emit("close");
  url.value = "";
};
</script>
