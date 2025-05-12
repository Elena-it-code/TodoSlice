import { z } from "zod"

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, { message: "Incorrect email address" }),
  password: z.string().min(4, { message: "Must be 5 or more characters long" }),
  rememberMe: z.boolean(),
})

export type LoginForm = z.infer<typeof LoginSchema>
