"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { revalidatePath } from "next/cache"
import { createCommentSchema, CreateCommentInput } from "./schemas"
import { logActivity } from "../activity/actions"

export async function addCommentAction(taskId: string, projectId: string, input: CreateCommentInput) {
  try {
    const { organization, user } = await getCurrentOrganization()
    
    // Validate
    const validated = createCommentSchema.parse(input)

    const supabase = (await createClient()) as any

    // Insert comment
    const { data: comment, error: commentError } = await (supabase
      .from("task_comments")
      .insert({
        task_id: taskId,
        user_id: user.id,
        content: validated.content,
      } as any)
      .select("*")
      .single() as any)

    if (commentError) throw new Error(commentError.message)

    // Log activity
    await logActivity({
      organizationId: organization.id,
      actorId: user.id,
      entityType: "task",
      entityId: taskId,
      action: "add_comment",
      metadata: { comment_id: comment.id },
    })

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`)
    return { data: comment }
  } catch (error: any) {
    return { error: error.message || "Failed to add comment" }
  }
}

export async function deleteCommentAction(commentId: string, projectId: string) {
  try {
    const { user } = await getCurrentOrganization()
    const supabase = (await createClient()) as any

    // Soft delete check ownership logic
    const { data: comment } = await (supabase
        .from("task_comments")
        .select("user_id, task_id")
        .eq("id", commentId)
        .single() as any)
    
    if (!comment || comment.user_id !== user.id) {
        throw new Error("Unauthorized to delete this comment")
    }

    const { error } = await (supabase
      .from("task_comments")
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq("id", commentId) as any)

    if (error) throw new Error(error.message)

    revalidatePath(`/projects/${projectId}/tasks/${comment.task_id}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete comment" }
  }
}
