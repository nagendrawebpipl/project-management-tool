import { createClient } from "@/lib/supabase/server"

export async function getCommentsByTask(taskId: string) {
  const supabase = await createClient()

  try {
    const { data: joinedData, error: joinError } = await supabase
      .from("task_comments")
      .select(`
        *,
        user:profiles(full_name, avatar_url)
      `)
      .eq("task_id", taskId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getCommentsByTask join failed, attempting manual fetch:", joinError.message)
    const { data: comments, error: commentsError } = await supabase
      .from("task_comments")
      .select("*")
      .eq("task_id", taskId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })

    if (commentsError) throw commentsError
    if (!comments || comments.length === 0) return []

    const userIds = Array.from(new Set((comments as any[]).map(c => c.user_id)))
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (comments as any[]).map(comment => ({
      ...comment,
      user: profileMap.get(comment.user_id) || null
    }))
  } catch (error: any) {
    console.error("Error fetching comments:", JSON.stringify(error))
    return []
  }
}