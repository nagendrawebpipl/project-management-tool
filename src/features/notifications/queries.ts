import { createClient } from "@/lib/supabase/server"

export async function getNotifications(userId: string, limit = 20) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data
}

export async function getUnreadCount(userId: string) {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) throw new Error(error.message)
  return count ?? 0
}
