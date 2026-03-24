import { createClient } from "@/lib/supabase/server"

export async function getOrganizationMembers(organizationId: string) {
  const supabase = await createClient()
  try {
    // Attempt join first
    const { data: joinedData, error: joinError } = await supabase
      .from("organization_members")
      .select("*, profile:profiles!fk_organization_members_profiles(*)")
      .eq("organization_id", organizationId)
      .eq("status", "active")

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getOrganizationMembers join failed, attempting manual fetch:", joinError.message)
    const { data: members, error: membersError } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active")

    if (membersError) throw membersError

    if (!members || members.length === 0) return []

    const userIds = (members as any[]).map(m => m.user_id)
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (members as any[]).map(member => ({
      ...member,
      profile: profileMap.get(member.user_id) || null
    }))
  } catch (error: any) {
    console.error("getOrganizationMembers query error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    console.error("getOrganizationMembers catch block:", error)
    return []
  }
}
