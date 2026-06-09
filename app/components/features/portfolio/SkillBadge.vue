<template>
  <Badge
    :key="props.skill.name"
    :size="props.size"
    variant="outline"
    class="skill-badge"
    :style="{ '--skill-color': `var(--skill-${props.skill.color})` }"
  >
    {{ props.skill.name }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import type { BadgeVariants } from "@/components/ui/badge";
import type { Skill } from "@/types";

const props = defineProps<{
  skill: Skill;
  size?: BadgeVariants["size"];
}>();
</script>
<style lang="scss" scoped>
.skill-badge {
  border-radius: 6px;

  --skill-color: var(--color-gray-05);
  border-color: color-mix(in srgb, var(--skill-color) 45%, transparent);
  background-color: color-mix(in srgb, var(--skill-color) 10%, white);
  color: color-mix(in srgb, var(--skill-color) 70%, black);
  font-weight: 700;

  @include lg {
    font-size: 18px;
  }
}
</style>
