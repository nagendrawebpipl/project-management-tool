import { createClient } from "@/lib/supabase/server"

/**
 * Creates a notification for a user.
 */
export async function createNotification({
  user_id,
  type,
  title,
  content,
  link,
  organization_id,
}: {
  user_id: string
  type: string
  title: string
  content: string
  link?: string
  organization_id: string
}) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from("notifications")
    .insert({
      user_id,
      type,
      title,
      content,
      link,
      organization_id,
    } as any) as any)

  if (error) {
    console.error("Failed to create notification:", error)
    return { error: error.message }
  }

  return { success: true }
}
