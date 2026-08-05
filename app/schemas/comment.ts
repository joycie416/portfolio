import z from "zod";

export const commentSchema = z.object({
  postId: z.number().int(),
  nickname: z
    .string()
    .trim()
    .min(2, { message: "닉네임을 2자 이상 입력해주세요." })
    .max(10, { message: "닉네임은 10자 이하로 입력해주세요." }),
  password: z
    .string()
    .min(4, { message: "비밀번호를 4자 이상 입력해주세요." })
    .max(10, { message: "비밀번호는 10자 이하로 입력해주세요." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "영문 대소문자와 숫자만 사용할 수 있습니다.",
    }),
  content: z
    .string()
    .trim()
    .min(1, { message: "내용을 입력해주세요." })
    .max(1000, { message: "1,000자 이하로 입력해주세요." }),
});

export type CommentForm = z.infer<typeof commentSchema>;
