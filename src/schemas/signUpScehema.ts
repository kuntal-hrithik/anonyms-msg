import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email({ message: "please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
