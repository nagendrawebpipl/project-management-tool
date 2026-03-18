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

export async function getDashboardStats(orgId: string) {
  const supabase = await createClient()

  // Fetch projects count
  const { count: projectCount, error: projectError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", orgId)

  // Fetch tasks for counts
  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("status, priority")
    .eq("organization_id", orgId)

  if (projectError) throw new Error(projectError.message)
  if (taskError) throw new Error(taskError.message)

  const totalTasks = tasks?.length || 0;
  const typedTasks = (tasks || []) as { status: string; priority: string }[];
  const completedTasks = typedTasks.filter(t => t.status === "done").length;
  const urgentTasks = typedTasks.filter(t => t.priority === "critical" || t.priority === "high").length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusCounts = {
    todo: typedTasks.filter(t => t.status === "todo").length,
    in_progress: typedTasks.filter(t => t.status === "in_progress").length,
    review: typedTasks.filter(t => t.status === "review").length,
    done: completedTasks,
  };

  const priorityCounts = {
    low: typedTasks.filter(t => t.priority === "low").length,
    medium: typedTasks.filter(t => t.priority === "medium").length,
    high: typedTasks.filter(t => t.priority === "high").length,
    urgent: typedTasks.filter(t => t.priority === "critical").length,
  };

  return {
    projectCount: projectCount || 0,
    totalTasks,
    completedTasks,
    urgentTasks,
    completionRate,
    statusCounts,
    priorityCounts
  };
}
