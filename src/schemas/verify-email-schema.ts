import { z } from "zod"

export const VerifyEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  code: z
    .string()
    .length(6, { message: "Code must be 6 digits" })
    .regex(/^\d{6}$/, { message: "Code must be numeric" }),
})
