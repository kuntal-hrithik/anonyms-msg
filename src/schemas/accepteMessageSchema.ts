import { z } from "zod";

export const accepteMessageSchema = z.object({
  isAcceptingMessages: z.boolean(),
});
