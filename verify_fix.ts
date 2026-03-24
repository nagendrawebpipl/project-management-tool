import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wjrrlunirxchfdcmeuvm.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnJsdW5pcnhjaGZkY21ldXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM3ODgyMiwiZXhwIjoyMDg4OTU0ODIyfQ.Qkun8C6jGAw0U2dje_0m9jMOkJ-mZyBSTfTbPI4-ZQw"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFallbackLogic() {
  const projectId = "78cd676a-73c2-4217-bc09-913459c55b6c"

  console.log("\n--- Testing getProject Fallback Logic ---")
  try {
    // Stage 1: Attempt the join that we know fails
    const { data: joinedData, error: joinError } = await supabase
      .from("projects")
      .select("*, created_by_profile:profiles!projects_created_by_fkey(*)")
      .eq("id", projectId)
      .maybeSingle()

    if (joinError) {
      console.log("Join expectedly failed:", joinError.message)
      
      // Stage 2: Perform the fallback manual fetch
      console.log("Starting manual fallback fetch...")
      const { data: project, error: pError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single()
      
      if (pError) throw pError

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", (project as any).created_by)
        .single()
      
      console.log("SUCCESS: getProject fallback worked")
      console.log("Project Name:", project.name)
      console.log("Profile Name:", profile?.full_name)
    } else {
      console.log("SUCCESS: Join worked unexpectedly (maybe migrations were applied?)")
    }
  } catch (err: any) {
    console.error("FAILURE in getProject fallback test:", err.message)
  }

  console.log("\n--- Testing getTasksByProject Fallback Logic ---")
  try {
    const { data: joinedTasks, error: tJoinError } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*)")
      .eq("project_id", projectId)

    if (tJoinError) {
      console.log("Tasks join expectedly failed:", tJoinError.message)
      
      // Stage 2: Manual fetch
      const { data: tasks, error: tError } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
      
      if (tError) throw tError
      
      const profileIds = Array.from(new Set(
        tasks.flatMap(t => [(t as any).assignee_id, (t as any).reporter_id]).filter(Boolean)
      ))
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", profileIds)

      console.log(`SUCCESS: getTasksByProject fallback worked. Found ${tasks.length} tasks and ${profiles?.length} profiles.`)
    } else {
      console.log("SUCCESS: Tasks join worked unexpectedly")
    }
  } catch (err: any) {
    console.error("FAILURE in getTasksByProject fallback test:", err.message)
  }
}

testFallbackLogic()
