import { createClient } from "@/lib/supabase/server"

export async function getActivityByEntity(entityType: string, entityId: string, limit = 50) {
  const supabase = await createClient()
  
  try {
    const { data: joinedData, error: joinError } = await supabase
      .from("activity_logs")
      .select(`
        *,
        actor:profiles!actor_id(full_name, avatar_url)
      `)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getActivityByEntity join failed, attempting manual fetch:", joinError.message)
    const { data: logs, error: logsError } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (logsError) throw logsError
    if (!logs || logs.length === 0) return []

    // Fetch unique actor profiles
    const actorIds = Array.from(new Set((logs as any[]).map(log => log.actor_id)))
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", actorIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (logs as any[]).map(log => ({
      ...log,
      actor: profileMap.get(log.actor_id) || null
    }))
  } catch (error: any) {
    console.error("Error fetching activity:", error)
    return []
  }
}

export async function getRecentActivity(organizationId: string, limit = 10) {
  const supabase = await createClient()

  try {
    const { data: joinedData, error: joinError } = await supabase
      .from("activity_logs")
      .select(`
        *,
        actor:profiles!actor_id(full_name, avatar_url)
      `)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getRecentActivity join failed, attempting manual fetch:", joinError.message)
    const { data: logs, error: logsError } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (logsError) throw logsError
    if (!logs || logs.length === 0) return []

    const actorIds = Array.from(new Set((logs as any[]).map(log => log.actor_id)))
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", actorIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (logs as any[]).map(log => ({
      ...log,
      actor: profileMap.get(log.actor_id) || null
    }))
  } catch (error: any) {
    console.error("Error fetching recent activity:", error)
    return []
  }
}
