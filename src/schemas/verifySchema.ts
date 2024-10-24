import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z
    .string()
    .min(4, { message: "verify code must be 4 characters" }),
});
