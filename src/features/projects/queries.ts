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
  const { data, error } = await supabase
    .from("projects")
    .select("*, created_by_profile:profiles!projects_created_by_fkey(*)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getProjectMembers(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("project_members")
    .select("*, profile:profiles(*)")
    .eq("project_id", projectId)

  if (error) throw error
  return data
}
