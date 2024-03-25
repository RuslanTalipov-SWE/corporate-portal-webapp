import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Заголовок должен быть длиной не менее 3 символов",
    })
    .max(150, {
      message: "Заголовок должен быть длиной не более 150 символов",
    }),
  communityId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
