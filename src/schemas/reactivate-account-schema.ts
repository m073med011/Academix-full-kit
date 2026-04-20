import { z } from "zod"

export const ReactivateAccountSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .toLowerCase()
      .trim(),
    password: z.string().optional(),
    isOAuthUser: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Password is required only for non-OAuth users
      if (!data.isOAuthUser) {
        return (
          !!data.password &&
          data.password.length >= 8 &&
          data.password.length <= 250 &&
          /(?=.*[a-zA-Z])/.test(data.password) &&
          /(?=.*[0-9])/.test(data.password)
        )
      }
      return true
    },
    {
      message: "Password must contain at least 8 characters, one letter, and one number.",
      path: ["password"],
    }
  )

export const ConfirmReactivateAccountSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must be numeric" }),
})
