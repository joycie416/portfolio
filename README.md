# Haein's Portfolio

개인 경력·프로젝트를 소개하는 **포트폴리오**와, Supabase 기반으로 직접 만든 **블로그 CMS**를 함께 운영하는 Nuxt 4 프로젝트입니다.

배포 링크 : https://portfolio-haein.vercel.app

## 1. 소개

- **포트폴리오**: 프로필, 기술 스택, 참여했던 프로젝트의 기여 내용을 소개하는 페이지
- **블로그**: 글을 읽고 검색하고 댓글을 남길 수 있는 공개 영역과, 직접 만든 관리자 화면(글 작성/수정, 댓글·메뉴 관리)을 갖춘 **자체 제작 CMS**
- Supabase(Auth / Database / Storage)를 활용해 백엔드 서버를 구축해 인증과 데이터를 처리
- **Vercel**에 배포되어 있으며, Lighthouse로 이미지 최적화 등 성능 개선을 지속적으로 측정

## 2. 주요 기능

#### 포트폴리오

- 프로필 소개, 기술 스택, 프로젝트 목록을 스크롤로 보여주는 원페이지 구성

#### 블로그 (공개 영역)

- 메뉴별 게시글 목록, 검색, 페이지네이션
- 게시글 상세: 첨부파일 다운로드, 태그, 관련 글 목록, Tiptap 코드 블록 문법 강조
- **비회원 댓글**: 로그인 없이 닉네임 + 비밀번호로 댓글 작성/수정/삭제 (비밀번호 검증 단계 포함)

#### 블로그 관리자 (Admin CMS)

- Supabase Auth 로그인 + 전역 미들웨어 기반 관리자 경로 보호, 로그인 후 원래 페이지로 리다이렉트
- Tiptap 에디터로 게시글 작성/수정 (이미지, 첨부파일, 표, 코드 블록, 썸네일)
- 게시글 목록 검색/필터링, 체크박스 다중 선택 후 일괄 처리
- 댓글 검색/필터링 및 삭제
- 메뉴 드래그 앤 드롭 순서 변경, 공개/숨김 상태 관리

#### 기타

- SEO: 사이트맵 자동 생성, OG 메타 태그, 검색엔진 사이트 인증

## 3. 기술 스택

| 구분              | 스택                                                    |
| ----------------- | ------------------------------------------------------- |
| Framework         | Nuxt 4, Vue 3, TypeScript                               |
| Backend           | Supabase (Auth, Database, Storage)                      |
| UI                | Tailwind CSS 4, shadcn-vue, SCSS                        |
| Form / 검증       | vee-validate, zod                                       |
| 에디터            | Tiptap (이미지, 파일, 표, 코드 블록 하이라이팅 등 확장) |
| 데이터 / 인터랙션 | TanStack Table, vue-draggable-plus, dayjs               |

## 4. 아키텍처

#### 인증 / 미들웨어 체계

- Supabase Auth(이메일/비밀번호) 기반 인증을 사용. 별도 회원가입 없이 관리자 계정만 운영.
- 전역 미들웨어 2단계로 로그인 흐름을 분리
  - `01.admin-auth.global.ts`: `/blog/admin/**` 접근 시 인증 여부를 확인하고, 비로그인 사용자는 원래 경로를 redirect 쿼리에 저장한 뒤 로그인 페이지로 이동
    - /blog/admin/login은 관리자 경로 하위에 있으므로 인증 검사에서 예외 처리해 리다이렉트 루프를 방지
  - `02.auth-redirect.global.ts`: 로그인 페이지 접근 시 `redirect` 쿼리가 없으면 이전 경로(`from.fullPath`)로 자동 설정.
  - 로그인 성공 후 `usePostLoginRedirect`가 `redirect` 쿼리 -> `referrer` -> 기본 경로(`/blog`) 순으로 복귀 위치를 결정.
- 페이지 단위 미들웨어(`validate-post`, `validate-menu`, `validate-edit-post`)로 존재하지 않는 게시글/메뉴 접근을 차단.
- 클라이언트 라우팅 방어와는 별개로, Supabase RLS(Row Level Security)가 실제 데이터 접근 권한을 최종적으로 한 번 더 통제.

| 테이블           | 비로그인(public)             | 로그인(authenticated)            |
| ---------------- | ---------------------------- | -------------------------------- |
| `menus`, `posts` | `hidden = false`인 행만 조회 | 전체 조회 및 생성/수정/삭제 가능 |
| `comments`       | 조회 및 생성                 | 삭제 가능                        |
| `temp_posts`     | 접근 불가                    | 전체 권한                        |

> 비회원 댓글 수정/삭제는 직접 테이블을 수정하지 않고, 비밀번호 검증 RPC를 통해서만 처리.

#### Supabase 데이터베이스 설계

- **주요 테이블**
  - `menus` : 메뉴(카테고리), 자기참조 `parent_id`로 최대 2단계 (부모, 부모-자식) 구조
  - `posts` : 게시글
  - `temp_posts` : 임시저장 게시글
  - `comments` : 비회원 댓글
- **메뉴 순서 / 공개 상태**
  - `fn_menus_reorder` (RPC): 드래그로 바뀐 순서(`order_idx`, `parent_id`)를 한 번에 반영.
  - `fn_menus_reorder_on_delete` (트리거): 메뉴 삭제 시 남은 형제들의 `order_idx`를 재정렬하고, 삭제된 부모의 자식들을 최상위로 승격.
  - `fn_menus_sync_hidden` 부모-자식의 `hidden` 상태를 동기화.
- **게시글 관리**
  - `posts_bulk_delete`, `posts_bulk_move_menu`, `posts_bulk_update_hidden`: 관리자 화면의 다중 선택 일괄 처리용 RPC.
    - 실패한 행만 반환해 부분 실패를 구분할 수 있게 함.
  - `search_posts_or_title_phrase_or_tags_any` : 제목 부분 일치 또는 태그 기반 검색.
  - `get_post_neighbors` : 게시글 상세의 이전/다음 글 조회.
- **비회원 댓글**
  - `fn_comments_hash_password` (트리거): 댓글 저장/수정 시 비밀번호를 `pgcrypto`(bcrypt)로 해싱.
  - `comment_anon_verify_password`, `comment_anon_update`, `comment_anon_delete`: 비밀번호 검증에 성공했을 때만 수정/삭제를 허용하는 `SECURITY DEFINER` RPC.

---
