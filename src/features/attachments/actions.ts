"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { revalidatePath } from "next/cache"
import { logActivity } from "../activity/actions"

export async function deleteAttachmentAction(attachmentId: string, projectId: string) {
  try {
    const { organization, user } = await getCurrentOrganization()
    const supabase = await createClient()

    // Get attachment info
    const { data: attachment } = await supabase
      .from("task_attachments")
      .select("*")
      .eq("id", attachmentId)
      .single()

    if (!attachment) throw new Error("Attachment not found")

    // Check permissions (uploader or manager+)
    // Simplified MVP: uploader only for now
    if (!attachment || (attachment as any).uploaded_by !== user.id) {
        throw new Error("Unauthorized to delete this attachment")
    }

    // Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("task-attachments")
      .remove([(attachment as any).file_path])

    if (storageError) console.warn("Storage deletion warning:", storageError.message)

    // Delete from DB
    const { error: dbError } = await supabase
      .from("task_attachments")
      .delete()
      .eq("id", attachmentId)

    if (dbError) throw new Error(dbError.message)

    // Log Activity
    await logActivity({
      organizationId: organization.id,
      actorId: user.id,
      entityType: "task",
      entityId: (attachment as any).task_id,
      action: "delete_attachment",
      metadata: { file_name: (attachment as any).file_name },
    })

    revalidatePath(`/projects/${projectId}/tasks/${(attachment as any).task_id}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to delete attachment" }
  }
}
