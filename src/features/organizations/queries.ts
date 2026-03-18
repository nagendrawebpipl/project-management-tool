import { createClient } from "@/lib/supabase/server"

export async function getOrganizationMembers(organizationId: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*, profile:profiles!fk_organization_members_profiles(*)")
      .eq("organization_id", organizationId)
      .eq("status", "active")

    if (error) throw error
    return data
  } catch (error: any) {
    console.error("getOrganizationMembers query error:", error)
    return []
  }
}
