import { createClient } from "@/lib/supabase/server"

export async function logActivity({
  organizationId,
  actorId,
  entityType,
  entityId,
  action,
  metadata = {},
}: {
  organizationId: string
  actorId: string
  entityType: string
  entityId: string
  action: string
  metadata?: any
}) {
  const supabase = await createClient()

  const { error } = await (supabase.from("activity_logs").insert({
    organization_id: organizationId,
    actor_id: actorId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    metadata,
  } as any) as any)

  if (error) {
    console.error("Failed to log activity:", error)
    // We don't throw here to avoid failing the main action
  }
}
