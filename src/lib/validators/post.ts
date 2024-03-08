import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Заголовок должен быть длиной не менее 3 символов",
    })
    .max(50, {
      message: "Заголовок должен быть длиной не более 50",
    }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
