<template>
  <main class="layout__main">
    <div class="layout__top">
      <NuxtImg
        v-if="props.topImage"
        :src="props.topImage"
        alt=""
        class="layout__top__image"
        fit="cover"
        format="webp"
        width="1920"
        height="768"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw 1920:100vw"
        densities="1"
        quality="75"
        loading="eager"
        fetchpriority="high"
        :preload="{ fetchPriority: 'high' }"
      />
      <div class="layout__top__overlay">
        <div class="layout__top__content">
          <slot name="top" />
        </div>
      </div>
    </div>
    <div class="layout__content">
      <slot name="content" />
    </div>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  topImage?: string;
}>();
</script>

<style lang="scss" scoped>
.layout {
  &__main {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
  }

  &__content {
    width: 100%;
    max-width: 1024px;
    flex: 1;
    margin: 0 auto;
    padding: 20px;

    display: flex;
    flex-direction: column;
    gap: 24px;

    @include md {
      padding: 32px 20px;
      gap: 40px;
    }
  }

  &__top {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    position: relative;
    background: var(--color-gray-03);

    @include md {
      aspect-ratio: 5/2;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
    }

    &__overlay {
      position: absolute;
      inset: 0;

      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--color-white) 50%, transparent) 0%,
        color-mix(in srgb, var(--color-primary-45) 50%, transparent) 70%,
        var(--color-primary-45) 98%
      );
    }

    &__content {
      width: 100%;
      max-width: 1024px;
      height: 100%;
      margin: 0 auto;
      padding: 20px;

      display: flex;
      flex-direction: column;
      gap: 24px;

      @include lg {
        padding: 32px 20px;
        gap: 40px;
      }
    }
  }
}
</style>
