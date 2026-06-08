<script setup lang="ts">
import { Cake, GraduationCap, Mail, MapPinHouse, UserRound } from "@lucide/vue";
</script>

<template>
  <section
    id="profile"
    class="relative min-h-screen px-5 py-10 md:min-h-fit lg:min-h-screen lg:px-0 lg:py-20"
  >
    <!-- 배경 이미지 -->
    <NuxtImg
      src="/images/BackgroundImage01.jpg"
      alt=""
      format="webp"
      fit="cover"
      class="absolute inset-0 size-full"
    />
    <!-- 배경 이미지 오버레이 -->
    <div aria-hidden="true" class="absolute inset-0 bg-gray-02 opacity-65" />

    <div
      class="relative w-full max-w-[1024px] h-full mx-auto flex flex-col py-5 space-y-6 lg:py-0 lg:space-y-10"
    >
      <p
        class="font-rix text-2xl leading-[1.3] text-center text-white md:text-4xl lg:text-5xl"
      >
        조해인<br />FRONTEND PORTFOLIO
      </p>

      <div class="profile">
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
        <div
          class="flex-1 md:max-w-[360px] lg:max-w-[420px] mx-auto space-y-10"
        >
          <div>
            <p
              class="text-base font-semibold tracking-tight text-text-gray-02 text-center whitespace-nowrap lg:text-xl"
            >
              수학의 증명 과정처럼, 프로그래밍 역시<br />
              주어진 조건을 분석하고 원하는 결과에 도달하는<br />로직을 설계하는
              과정이라고 생각합니다.
            </p>
          </div>
          <hr class="w-1/2 mx-auto border border-gray-05" />
          <ul class="profile__list">
            <li>
              <UserRound />
              <label for="name">이름</label>
              <hr />
              <p id="name">조해인</p>
            </li>
            <li>
              <Cake />
              <label for="birthday">생년월일</label>
              <hr />
              <p id="birthday">98. 04. 16.</p>
            </li>
            <li>
              <Mail />
              <label for="email">이메일</label>
              <hr />
              <p id="email">joycie416@gmail.com</p>
            </li>
            <li>
              <MapPinHouse />
              <label for="address">주소</label>
              <hr />
              <p id="address">서울특별시 종로구</p>
            </li>
            <li>
              <GraduationCap />
              <label for="education">학력</label>
              <hr />
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
  padding: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  background-color: var(--color-primary-45);
  border: 1px solid var(--color-gray-02);
  border-radius: 32px;
  backdrop-filter: blur(8px);

  @include md {
    padding: 60px;
    flex-direction: row;
    gap: 80px;
  }

  @include lg {
    padding: 80px;
    gap: 120px;
  }

  &__image {
    overflow: hidden;

    width: 50%;
    aspect-ratio: 3 / 4;
    border-radius: 50%;
    background-color: var(--color-gray-02);

    @include md {
      max-width: 300px;
    }
    @include lg {
      max-width: 320px;
    }
  }

  &__list {
    @include md {
      padding: 0 0 0 40px;
    }
    @include lg {
      padding: 0 0 0 20px;
    }

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;

      &:last-child {
        margin-bottom: 0;
      }

      @include lg {
        gap: 20px;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 500;
      }

      svg {
        flex-shrink: 0;
        width: 18px;
        height: 18px;

        @include md {
          width: 18px;
          height: 18px;
        }
        @include lg {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
        }
      }

      label {
        width: 52px;

        @include lg {
          width: 56px;
        }
      }

      hr {
        height: 16px;
        border-left: 1px solid var(--color-gray-05);
      }
    }
  }
}
</style>
