import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database.types"

type ActivityLogInsert = Database["public"]["Tables"]["activity_logs"]["Insert"]

/**
 * Utility function to log activities in the organization.
 */
export async function logActivity(activity: ActivityLogInsert) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("activity_logs")
    .insert(activity as any)

  if (error) {
    console.error("Failed to log activity:", error)
  }
}
