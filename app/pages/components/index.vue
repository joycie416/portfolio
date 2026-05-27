<template>
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
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
</script>
