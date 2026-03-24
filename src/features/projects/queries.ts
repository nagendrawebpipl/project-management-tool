import { createClient } from "@/lib/supabase/server"

export async function getProjects(organizationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_id", organizationId)
    .neq("status", "archived")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(id: string) {
  const supabase = await createClient()
  try {
    // Attempt join first
    const { data: joinedData, error: joinError } = await supabase
      .from("projects")
      .select("*, created_by_profile:profiles!projects_created_by_fkey(*)")
      .eq("id", id)
      .single()

    if (!joinError) return joinedData

    // Fallback if join fails due to missing relationship
    console.warn("getProject join failed, attempting manual fetch:", joinError.message)
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (projectError) throw projectError

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", (project as any).created_by)
      .single()

    return {
      ...(project as any),
      created_by_profile: profile || null,
    }
  } catch (error: any) {
    console.error("getProject query error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    console.error("getProject catch block:", error)
    return null
  }
}

export async function getProjectMembers(projectId: string) {
  const supabase = await createClient()
  try {
    // Attempt join first
    const { data: joinedData, error: joinError } = await supabase
      .from("project_members")
      .select("*, profile:profiles(*)")
      .eq("project_id", projectId)

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getProjectMembers join failed, attempting manual fetch:", joinError.message)
    const { data: members, error: membersError } = await supabase
      .from("project_members")
      .select("*")
      .eq("project_id", projectId)

    if (membersError) throw membersError
    if (!members || members.length === 0) return []

    const userIds = Array.from(new Set((members as any[]).map(m => m.user_id)))
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
    console.error("getProjectMembers query error details:", error)
    return []
  }
}
