import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z.string().optional().nullable(),
})

export type TaskValues = z.infer<typeof taskSchema>

export const updateTaskSchema = taskSchema.partial()

export type UpdateTaskValues = z.infer<typeof updateTaskSchema>

export const moveTaskSchema = z.object({
  taskId: z.string().uuid(),
  newStatus: z.enum(["todo", "in_progress", "review", "done"]),
  newPosition: z.number(),
})

export type MoveTaskValues = z.infer<typeof moveTaskSchema>
