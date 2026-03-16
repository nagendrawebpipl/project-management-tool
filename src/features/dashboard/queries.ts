import { createClient } from "@/lib/supabase/server"

export async function getMyTasks(userId: string, orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (
        name
      )
    `)
    .eq("organization_id", orgId)
    .eq("assignee_id", userId)
    .neq("status", "done")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(10)

  if (error) throw new Error(error.message)
  return data
}

export async function getOverdueTasks(orgId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      projects (
        name
      )
    `)
    .eq("organization_id", orgId)
    .neq("status", "done")
    .lt("due_date", today)
    .order("due_date", { ascending: true })
    .limit(10)

  if (error) throw new Error(error.message)
  return data
}

export async function getTaskCountsByStatus(orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("status")
    .eq("organization_id", orgId)

  if (error) throw new Error(error.message)

  const counts = {
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  };

  if (data) {
    for (const task of (data as any[])) {
      const status = task.status as keyof typeof counts;
      if (status in counts) {
        counts[status]++;
      }
    }
  }

  return counts;
}

export async function getProjectSummary(orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_id", orgId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) throw new Error(error.message)
  return data
}
