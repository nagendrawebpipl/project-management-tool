import { createClient } from "@/lib/supabase/server"

export async function getCommentsByTask(taskId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("task_comments")
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq("task_id", taskId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", JSON.stringify(error))
    return []
  }

  return data
}