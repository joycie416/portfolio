<script setup lang="ts">
import { Cake, GraduationCap, Mail, MapPinHouse, UserRound } from "@lucide/vue";
</script>

<template>
  <section id="profile" class="relative min-h-screen py-20">
    <!-- 배경 이미지 -->
    <NuxtImg
      src="/images/BackgroundImage01.jpg"
      alt=""
      format="webp"
      fit="cover"
      class="absolute top-0 size-full"
    />
    <!-- 배경 이미지 오버레이 -->
    <div aria-hidden="true" class="absolute inset-0 bg-gray-02 opacity-65" />

    <div
      class="relative w-full max-w-[1024px] h-full mx-auto py-10 flex flex-col space-y-10"
    >
      <p class="font-rix text-5xl leading-[1.3] text-center text-white">
        조해인<br />FRONTEND PORTFOLIO
      </p>

      <div class="profile bg-primary-45 border border-gray-02 rounded-[32px]">
        <!-- 프로필 사진 -->
        <div class="profile__image">
          <NuxtImg
            src="/images/ProfileImage.jpg"
            alt="profile_image"
            format="webp"
            fit="cover"
            class="size-full"
          />
        </div>

        <!-- 내 정보 -->
        <div class="flex-1 space-y-10">
          <div>
            <p
              class="text-xl font-semibold tracking-tight text-text-gray-02 text-center"
            >
              수학의 증명 과정처럼, 프로그래밍 역시<br />
              주어진 조건을 분석하고 원하는 결과에 도달하는<br />로직을 설계하는
              과정이라고 생각합니다.
            </p>
          </div>
          <hr class="w-1/2 mx-auto border border-gray-05" />
          <ul class="profile__list pl-10">
            <li>
              <UserRound />
              <label for="name" class="w-16">이름</label>
              <hr class="h-4 border border-gray-05" />
              <p id="name">조해인</p>
            </li>
            <li>
              <Cake />
              <label for="birthday" class="w-16">생년월일</label>
              <hr class="h-4 border border-gray-05" />
              <p id="birthday">98. 04. 16.</p>
            </li>
            <li>
              <Mail />
              <label for="email" class="w-16">이메일</label>
              <hr class="h-4 border border-gray-05" />
              <p id="email">joycie416@gmail.com</p>
            </li>
            <li>
              <MapPinHouse />
              <label for="address" class="w-16">주소</label>
              <hr class="h-4 border border-gray-05" />
              <p id="address">서울특별시 종로구</p>
            </li>
            <li>
              <GraduationCap />
              <label for="education" class="w-16">학력</label>
              <hr class="h-4 border border-gray-05" />
              <p id="education">강원대학교 수학과 이학석사</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile {
  width: 100%;
  height: fit-content;

  margin-inline: auto;
  padding: 80px;

  display: flex;
  align-items: center;
  gap: 120px;

  &__image {
    overflow: hidden;

    width: 100%;
    max-width: 320px;
    aspect-ratio: 3 / 4;
    border-radius: 50%;
    background-color: var(--color-gray-02);
  }

  &__list {
    li {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 500;

      &:last-child {
        margin-bottom: 0;
      }

      svg {
        flex-shrink: 0;
      }
    }
  }
}
</style>
