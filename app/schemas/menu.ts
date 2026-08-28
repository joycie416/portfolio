import z from "zod";

export const menuSchema = z.object({
  name: z.string().min(1, { message: "메뉴명을 입력해주세요." }),
  slug: z
    .string()
    .min(4, { message: "4자 이상 입력해주세요." })
    .max(16, { message: "16자 이하로 입력해주세요." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "영문, 숫자, _, - 만 사용할 수 있으며 공백은 포함할 수 없습니다.",
    })
    .regex(/^[a-zA-Z]/, {
      message: "영문으로 시작해야 합니다.",
    }),
  hidden: z.boolean().default(false),
});

export type MenuForm = z.infer<typeof menuSchema>;
