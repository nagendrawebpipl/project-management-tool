import { createClient } from "@/lib/supabase/server"

export async function getCommentsByTask(taskId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("task_comments")
    .select(`
      *,
      user:profiles!task_comments_user_id_fkey(full_name, avatar_url)
    `)
    .eq("task_id", taskId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data
}
