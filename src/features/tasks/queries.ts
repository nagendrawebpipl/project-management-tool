import { createClient } from "@/lib/supabase/server"

export async function getTasksByProject(projectId: string) {
  const supabase = await createClient()
  try {
    // Attempt join first
    const { data: joinedData, error: joinError } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*)")
      .eq("project_id", projectId)
      .order("position", { ascending: true })

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getTasksByProject join failed, attempting manual fetch:", joinError.message)
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("position", { ascending: true })

    if (tasksError) throw tasksError

    if (!tasks || tasks.length === 0) return []

    // Batch fetch profiles
    const profileIds = Array.from(new Set(
      (tasks as any[]).flatMap(t => [t.assignee_id, t.reporter_id]).filter(Boolean)
    ))

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", profileIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return (tasks as any[]).map(task => ({
      ...task,
      assignee: task.assignee_id ? profileMap.get(task.assignee_id) || null : null,
      reporter: task.reporter_id ? profileMap.get(task.reporter_id) || null : null,
    }))
  } catch (error: any) {
    console.error("getTasksByProject query error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    console.error("getTasksByProject catch block:", error)
    return []
  }
}

export async function getTask(taskId: string) {
  const supabase = await createClient()
  try {
    // Attempt join first
    const { data: joinedData, error: joinError } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*), project:projects(*)")
      .eq("id", taskId)
      .single()

    if (!joinError) return joinedData

    // Fallback if join fails
    console.warn("getTask join failed, attempting manual fetch:", joinError.message)
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*, project:projects(*)")
      .eq("id", taskId)
      .single()

    if (taskError) throw taskError

    const profileIds = [(task as any).assignee_id, (task as any).reporter_id].filter(Boolean) as string[]
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", profileIds)

    const profileMap = new Map((profiles || []).map(p => [(p as any).id, p]))

    return {
      ...(task as any),
      assignee: (task as any).assignee_id ? profileMap.get((task as any).assignee_id) || null : null,
      reporter: (task as any).reporter_id ? profileMap.get((task as any).reporter_id) || null : null,
    }
  } catch (error: any) {
    console.error("getTask query error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    console.error("getTask catch block:", error)
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
