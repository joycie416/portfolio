<script setup lang="ts">
import {
  Cake,
  GraduationCap,
  Mail,
  MapPinHouse,
  PersonStanding,
  UserRound,
} from "@lucide/vue";
</script>

<template>
  <section id="top" class="min-h-screen py-20">
    <div
      class="w-full max-w-[1024px] h-full mx-auto py-10 flex flex-col space-y-10"
    >
      <p>여기에도 뭘 더 써놓으면 좋을 것 같은데</p>

      <div class="profile">
        <!-- 프로필 사진 -->
        <div class="profile__image">
          <PersonStanding class="w-full h-full object-cover" />
        </div>

        <!-- 내 정보 -->
        <div class="flex-1 space-y-20">
          <p>멘트 뭐라고 하면 좋을까</p>
          <ul class="profile__list">
            <li>
              <UserRound />
              <p>조해인</p>
            </li>
            <li>
              <Cake />
              <p>98. 04. 16.</p>
            </li>
            <li>
              <Mail />
              <p>joycie416(at)gmail.com</p>
            </li>
            <li>
              <MapPinHouse />
              <p>서울특별시 종로구</p>
            </li>
            <li>
              <GraduationCap />
              <p>강원대학교 수학과 이학석사</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
#top {
  background-image:
    linear-gradient(
      color-mix(in srgb, var(--color-primary-50) 65%, transparent),
      color-mix(in srgb, var(--color-primary-50) 65%, transparent)
    ),
    url("/images/BackgroundImage01.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.profile {
  width: 100%;
  height: fit-content;

  margin-inline: auto;
  padding: 80px;

  display: flex;
  align-items: center;
  gap: 120px;

  background-color: #ffffff;
  border-radius: 32px;

  &__image {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 3 / 4;
    border-radius: 50%;
    background-color: var(--color-primary-200);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__list {
    li {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;

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
