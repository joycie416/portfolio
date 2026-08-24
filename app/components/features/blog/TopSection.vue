<template>
  <section id="top" class="top-section">
    <NuxtImg src="/images/BackgroundImage01.jpg" class="background-image" />
    <div class="content">
      <h1>
        <span class="text-primary-500">Hi</span>
        <span>,</span>
        I'm
        <span>
          <span class="text-primary-700">H</span>
          <span>ae</span>
          <span class="text-primary-700">i</span>
          <span>n!</span>
        </span>
      </h1>
      <p>A blog for notes on what I learn while developing</p>
      <InputSearch theme="light" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { InputSearch } from "./";
</script>

<style lang="scss" scoped>
.top-section {
  width: 100%;
  min-height: calc(100vh - var(--header-height));
  position: relative;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.content {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--color-white) 50%, transparent);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-inline: 20px;

  color: white;

  h1 {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    margin-bottom: 20px;
    @include md {
      font-size: 48px;
    }
  }
  p {
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 20px;
    @include md {
      font-size: 24px;
    }
  }
  h1,
  p {
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
}
</style>
