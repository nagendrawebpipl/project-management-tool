import { createClient } from "@/lib/supabase/server"

export async function getAttachmentsByTask(taskId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("task_attachments")
    .select(`
      *,
      uploader:profiles!task_attachments_uploaded_by_fkey(full_name, avatar_url)
    `)
    .eq("task_id", taskId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching attachments:", error)
    return []
  }

  return data
}
