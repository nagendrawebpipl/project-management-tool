import { createClient } from "@/lib/supabase/server"

export async function getActivityByEntity(entityType: string, entityId: string, limit = 50) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("activity_logs")
    .select(`
      *,
      actor:profiles!actor_id(full_name, avatar_url)
    `)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching activity:", error)
    return []
  }

  return data
}

export async function getRecentActivity(organizationId: string, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("activity_logs")
    .select(`
      *,
      actor:profiles!actor_id(full_name, avatar_url)
    `)
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }

  return data
}
