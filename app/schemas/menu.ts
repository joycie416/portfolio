import z from "zod";

export const menuSchema = z.object({
  name: z.string().min(1, { message: "메뉴명을 입력해주세요." }),
  hidden: z.boolean(),
});

export type MenuForm = z.infer<typeof menuSchema>;
