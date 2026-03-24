"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { canCreateTask, canEditTask, canDeleteTask } from "@/lib/permissions"
import { taskSchema, updateTaskSchema, type TaskValues, type UpdateTaskValues, type MoveTaskValues } from "./schemas"
import { logActivity } from "@/features/activity/actions"

export async function createTaskAction(projectId: string, values: TaskValues) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canCreateTask(role)) {
    return { error: "Unauthorized" }
  }

  const validatedFields = taskSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const supabase = (await createClient()) as any

  // Get last position
  const { data: lastTask } = await (supabase
    .from("tasks")
    .select("position")
    .eq("project_id", projectId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle() as any)

  const position = ((lastTask as any)?.position ?? 0) + 1000

  const { data: task, error } = await (supabase
    .from("tasks")
    .insert({
      ...validatedFields.data,
      project_id: projectId,
      organization_id: organizationId,
      reporter_id: user.id,
      position,
    } as any)
    .select()
    .single() as any)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "task",
    entityId: task.id,
    action: "create",
  })

  // TODO: createNotification for assignee if present

  revalidatePath(`/projects/${projectId}`)
  return { data: task }
}

export async function updateTaskAction(taskId: string, values: UpdateTaskValues) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canEditTask(role)) {
    return { error: "Unauthorized" }
  }

  const validatedFields = updateTaskSchema.partial().safeParse(values)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const supabase = (await createClient()) as any

  // Get old task for diff (activity logging)
  const { data: oldTask } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .maybeSingle() as any

  const { data: task, error } = await (supabase
    .from("tasks")
    .update(validatedFields.data as any)
    .eq("id", taskId)
    .eq("organization_id", organizationId)
    .select()
    .single() as any)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "task",
    entityId: task.id,
    action: "update",
    metadata: {
      changes: validatedFields.data,
      previous: oldTask,
    },
  })

  revalidatePath(`/projects/${task.project_id}`)
  revalidatePath(`/projects/${task.project_id}/tasks/${taskId}`)
  return { data: task }
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canDeleteTask(role)) {
    return { error: "Unauthorized" }
  }

  const supabase = (await createClient()) as any

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("organization_id", organizationId)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "task",
    entityId: taskId,
    action: "delete",
  })

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function moveTaskAction(values: MoveTaskValues) {
  const { user: _user, organizationId, role } = await getCurrentOrganization()

  if (!canEditTask(role)) {
    return { error: "Unauthorized" }
  }

  const supabase = (await createClient()) as any

  const { data: task, error } = await (supabase
    .from("tasks")
    .update({ 
      status: values.newStatus, 
      position: values.newPosition 
    } as any)
    .eq("id", values.taskId)
    .eq("organization_id", organizationId)
    .select()
    .single() as any)

  if (error) return { error: error.message }

  revalidatePath(`/projects/${task.project_id}`)
  return { data: task }
}

export async function updateTaskPositionAction(
  taskId: string,
  projectId: string,
  status: string,
  position: number
) {
  const { organizationId, role } = await getCurrentOrganization()

  if (!canEditTask(role)) {
    return { error: "Unauthorized" }
  }

  const supabase = (await createClient()) as any

  const { error } = await (supabase
    .from("tasks")
    .update({ status: status as any, position } as any)
    .eq("id", taskId)
    .eq("organization_id", organizationId) as any)

  if (error) return { error: error.message }

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
