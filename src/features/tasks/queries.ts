import { createClient } from "@/lib/supabase/server"

export async function getTasksByProject(projectId: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*)")
      .eq("project_id", projectId)
      .order("position", { ascending: true })

    if (error) throw error
    return data
  } catch (error: any) {
    console.error("getTasksByProject query error:", error)
    return []
  }
}

export async function getTask(taskId: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*), project:projects(*)")
      .eq("id", taskId)
      .single()

    if (error) throw error
    return data
  } catch (error: any) {
    console.error("getTask query error:", error)
    return null
  }
}

export async function getTasksByProjectGroupedByStatus(projectId: string) {
  const tasks = await getTasksByProject(projectId)
  
  const initial: Record<string, any[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  }

  return (tasks as any[]).reduce((acc, task) => {
    const status = task.status
    if (acc[status]) {
      acc[status].push(task)
    }
    return acc
  }, initial)
}
