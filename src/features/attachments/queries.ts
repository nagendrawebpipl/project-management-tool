import { createClient } from "@/lib/supabase/server"

export async function getAttachmentsByTask(taskId: string) {
  const supabase = await createClient()

  try {
    const { data: joinedData, error: joinError } = await supabase
      .from("task_attachments")
      .select(`
        *,
        uploader:profiles(full_name, avatar_url)
      `)
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getAttachmentsByTask join failed, attempting manual fetch:", joinError.message)
    const { data: attachments, error: attachmentsError } = await supabase
      .from("task_attachments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (attachmentsError) throw attachmentsError
    if (!attachments || attachments.length === 0) return []

    const uploaderIds = Array.from(new Set((attachments as any[]).map(a => a.uploaded_by)))
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", uploaderIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (attachments as any[]).map(attachment => ({
      ...attachment,
      uploader: profileMap.get(attachment.uploaded_by) || null
    }))
  } catch (error: any) {
    console.error("Error fetching attachments:", JSON.stringify(error))
    return []
  }
}