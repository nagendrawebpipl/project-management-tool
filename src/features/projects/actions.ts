"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { canCreateProject, canEditProject, canArchiveProject } from "@/lib/permissions"
import { projectSchema, type ProjectValues, type UpdateProjectValues } from "./schemas"
import { logActivity } from "@/features/activity/actions"

export async function createProjectAction(values: ProjectValues) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canCreateProject(role)) {
    return { error: "Unauthorized" }
  }

  const validatedFields = projectSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const supabase = (await createClient()) as any

  const { data: project, error } = await (supabase
    .from("projects")
    .insert({
      ...validatedFields.data,
      organization_id: organizationId,
      created_by: user.id,
      status: "active",
    } as any)
    .select()
    .single() as any)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "project",
    entityId: project.id,
    action: "create",
  })

  revalidatePath("/projects")
  return { data: project }
}

export async function updateProjectAction(projectId: string, values: UpdateProjectValues) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canEditProject(role)) {
    return { error: "Unauthorized" }
  }

  const supabase = (await createClient()) as any

  const { data: project, error } = await (supabase
    .from("projects")
    .update(values as any)
    .eq("id", projectId)
    .eq("organization_id", organizationId)
    .select()
    .single() as any)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "project",
    entityId: project.id,
    action: "update",
    metadata: values,
  })

  revalidatePath("/projects")
  revalidatePath(`/projects/${projectId}`)
  return { data: project }
}

export async function archiveProjectAction(projectId: string) {
  const { user, organizationId, role } = await getCurrentOrganization()

  if (!canArchiveProject(role)) {
    return { error: "Unauthorized" }
  }

  const supabase = (await createClient()) as any

  const { error } = await (supabase
    .from("projects")
    .update({ status: "archived" } as any)
    .eq("id", projectId)
    .eq("organization_id", organizationId) as any)

  if (error) return { error: error.message }

  await logActivity({
    organizationId,
    actorId: user.id,
    entityType: "project",
    entityId: projectId,
    action: "archive",
  })

  revalidatePath("/projects")
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
