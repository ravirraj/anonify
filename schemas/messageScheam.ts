import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(3, "write more content ").max(100, "Limit reached "),
});
