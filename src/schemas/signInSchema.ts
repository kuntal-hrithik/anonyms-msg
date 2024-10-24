import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .email({ message: "please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
