"use server"

import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/auth/get-user"
import { revalidatePath } from "next/cache"

export async function markNotificationReadAction(notificationId: string) {
  try {
    const user = await getAuthUser()
    const supabase = await createClient()

    const { error } = await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id)

    if (error) throw new Error(error.message)

    revalidatePath("/notifications")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to mark notification as read" }
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const user = await getAuthUser()
    const supabase = await createClient()

    const { error } = await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) throw new Error(error.message)

    revalidatePath("/notifications")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to mark all as read" }
  }
}
