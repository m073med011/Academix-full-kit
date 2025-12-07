import { z } from "zod"

// Password regex matching backend requirements:
// - At least 8 characters
// - Must contain: uppercase, lowercase, number, special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]{8,}$/

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Full Name must contain at least 2 characters." })
      .max(100, { message: "Full Name must contain at most 100 characters." }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .toLowerCase()
      .trim(),
    role: z.enum(["student", "instructor", "freelancer", "organizer"], {
      message: "Please select a valid role",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must contain at least 8 characters",
      })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
    imageProfileUrl: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
