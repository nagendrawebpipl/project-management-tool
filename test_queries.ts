import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wjrrlunirxchfdcmeuvm.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnJsdW5pcnhjaGZkY21ldXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM3ODgyMiwiZXhwIjoyMDg4OTU0ODIyfQ.Qkun8C6jGAw0U2dje_0m9jMOkJ-mZyBSTfTbPI4-ZQw"

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQueries() {
  console.log("Testing queries on:", supabaseUrl)

  // 1. Test getProject equivalent
  console.log("\n--- Testing getProject query ---")
  const { data: project, error: pError } = await supabase
    .from("projects")
    .select("*, created_by_profile:profiles!projects_created_by_fkey(*)")
    .limit(1)
    .maybeSingle()

  if (pError) {
    console.error("getProject query failed:", {
      message: pError.message,
      details: pError.details,
      hint: pError.hint,
      code: pError.code
    })
  } else if (!project) {
    console.log("No projects found in the database.")
  } else {
    console.log("getProject query succeeded for project:", project.id)
  }

  // 2. Test getTasksByProject equivalent
  if (project) {
    console.log("\n--- Testing getTasksByProject query ---")
    const { data: tasks, error: tError } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*)")
      .eq("project_id", project.id)

    if (tError) {
      console.error("getTasksByProject query failed:", {
        message: tError.message,
        details: tError.details,
        hint: tError.hint,
        code: tError.code
      })
    } else {
      console.log(`getTasksByProject query succeeded: found ${tasks?.length} tasks`)
    }
  }

  // 3. Fallback test: Join without named foreign key
  console.log("\n--- Testing join WITHOUT named foreign key ---")
  const { data: simpleProject, error: spError } = await supabase
    .from("projects")
    .select("*, profiles(*)")
    .limit(1)

  if (spError) {
     console.error("Simple join failed:", spError.message)
  } else {
     console.log("Simple join succeeded")
  }

  // 4. Inspect columns of projects and tasks
  console.log("\n--- Inspecting projects columns ---")
  const { data: projData } = await supabase.from("projects").select("*").limit(1)
  if (projData && projData.length > 0) {
    console.log("Project columns:", Object.keys(projData[0]))
  }
}

testQueries()
