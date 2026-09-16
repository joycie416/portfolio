import type { Project } from "@/types/common";

export const PROJECT_DATA: Project[] = [
  {
    title: "개인 블로그",
    description: "포트폴리오 및 자체 CMS를 포함한 개인 블로그",
    contributions: [
      "이미지 전송 크기와 로딩 시점을 최적화해 Lighthouse LCP를 2.754s -> 0.550s(약 80% 단축), Performance 점수를 84 -> 100으로 개선",
      "비회원 댓글 비밀번호가 클라이언트에 노출되지 않도록 bcrypt 해싱과 RPC 기반 DB 검증 구조를 설계",
      "게시글 저장 전 ID가 필요한 파일 업로드 구조를 ID 발급 -> 업로드 -> 저장 흐름으로 재설계하고, 실패 시 고아 파일을 정리해 데이터 정합성을 확보",
      "메뉴 썸네일을 SSR 단계에서 미리 조회하도록 데이터 로딩 구조를 개선해 하이드레이션 시 발생하던 이미지 깜빡임을 제거",
      "관리자 인증과 리다이렉트 책임을 전역 미들웨어에서 분리하고, URL 교정 과정의 중복 인증을 방지해 인증 흐름을 안정화",
    ],
    skills: [
      { name: "Nuxt", color: "nuxt" },
      { name: "Vue", color: "vue" },
      { name: "TypeScript", color: "typescript" },
      { name: "Tailwind CSS", color: "tailwind-css" },
      { name: "Shadcn UI", color: "shadcn-ui" },
      { name: "Supabase", color: "supabase" },
      { name: "Tiptap", color: "tiptap" },
      { name: "Zod", color: "zod" },
      { name: "vee-validate", color: "vee-validate" },
    ],
    links: [
      {
        type: "demo",
        url: "https://portfolio-haein.vercel.app/",
        text: "Demo",
      },
      {
        type: "github",
        url: "https://github.com/joycie416/portfolio",
        text: "GitHub",
      },
    ],
  },
  {
    title: "GPUAASO",
    description: "GPU 자원과 AI 서비스 운영을 관리하는 플랫폼",
    contributions: [
      "사용자 권한 기반 접근 제어 설계",
      "쿼리스트링 변경 시 경합 상태가 발생해 데이터가 무한 로딩되는 문제 해결",
      "다국어(i18n) 및 테마 변경 기능 구현",
      "UI 일관성 개선 작업 수행",
    ],
    skills: [
      { name: "Next.js", color: "nextjs" },
      { name: "React", color: "react" },
      { name: "TypeScript", color: "typescript" },
      { name: "Axios", color: "axios" },
      { name: "TanStack Query", color: "tanstack-query" },
      { name: "Zustand", color: "zustand" },
      { name: "Tailwind CSS", color: "tailwind-css" },
      { name: "Shadcn UI", color: "shadcn-ui" },
    ],
  },
  {
    title: "API Hub",
    description: "API Hub 서비스의 관리자를 위한 웹 기반 대시보드 애플리케이션",
    contributions: [
      "form의 원본 상태를 별도로 생성해 변경 상태를 감지하던 로직을 isDirty를 사용하도록 리팩토링",
      "공동인증서 등록 UX 개선 - 다양한 예외 상황에 대한 사용자 피드백이 부족한 문제를 확인해, 오류 상황별 토스트 메시지를 추가함",
      "사용자 권한 조회 유틸 생성",
    ],
    skills: [
      { name: "Vite", color: "vite" },
      { name: "React", color: "react" },
      { name: "TypeScript", color: "typescript" },
      { name: "Axios", color: "axios" },
      { name: "TanStack Query", color: "tanstack-query" },
      { name: "Recoil", color: "recoil" },
      { name: "React Hook Form", color: "react-hook-form" },
      { name: "Zod", color: "zod" },
      { name: "Tailwind CSS", color: "tailwind-css" },
      { name: "Shadcn UI", color: "shadcn-ui" },
    ],
  },
  {
    title: "따꼼",
    description:
      "우리 아이 예방 접종 내역을 기록하고 접종 일정 및 동네 병원의 접종 정보를 확인할 수 있는 서비스",
    contributions: [
      "검색창 관련 상태를 하나의 상태로 관리할 수 있도록 리팩토링",
      "검색 후 페이지 로딩이 느린 문제 개선 - Next.js App Router에 Shallow 라우팅이 지원되지 않아 발생한 문제를 History API를 사용해 해결",
      "모바일/PC 환경 레이아웃을 추가해 window.matchMedia로 구현한 훅에 의한 리렌더링 횟수 감소",
    ],
    skills: [
      { name: "Next.js", color: "nextjs" },
      { name: "React", color: "react" },
      { name: "TypeScript", color: "typescript" },
      { name: "Supabase", color: "supabase" },
      { name: "TanStack Query", color: "tanstack-query" },
      { name: "Zustand", color: "zustand" },
      { name: "Tailwind CSS", color: "tailwind-css" },
      { name: "Shadcn UI", color: "shadcn-ui" },
    ],
    links: [
      {
        type: "demo",
        url: "https://takkom.vercel.app/",
        text: "Demo",
      },
      {
        type: "github",
        url: "https://github.com/seokwon27/takkom",
        text: "GitHub",
      },
    ],
  },
];
