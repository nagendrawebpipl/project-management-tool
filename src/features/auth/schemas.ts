import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
})

export type SignupValues = z.infer<typeof signupSchema>

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>
