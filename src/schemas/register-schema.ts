import { z } from "zod"

// Password regex matching backend requirements:
// - At least 8 characters
// - Must contain: uppercase, lowercase, number, special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]{8,}$/

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First Name must contain at least 2 characters." })
    .max(50, { message: "First Name must contain at most 50 characters." }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last Name must contain at least 2 characters." })
    .max(50, { message: "Last Name must contain at most 50 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, {
      message: "Password must contain at least 8 characters",
    })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  role: z.enum(["student", "freelancer", "instructor", "organizer"], {
    required_error: "Please select a role.",
  }),
  confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
