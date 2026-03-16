import { z } from "zod"

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
})

export type ProjectValues = z.infer<typeof projectSchema>

export const updateProjectSchema = projectSchema.extend({
  status: z.enum(["active", "completed", "archived"]),
})

export type UpdateProjectValues = z.infer<typeof updateProjectSchema>
