import { z } from "zod"

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, { message: "Incorrect email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" }),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),
})

export type LoginArgs = z.infer<typeof LoginSchema>
