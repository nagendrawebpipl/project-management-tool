import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for diagnostics

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars:", { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnostic() {
  console.log("Checking connection to:", supabaseUrl)
  
  // Check projects table
  console.log("\n--- Projects ---")
  const { data: projects, error: pError } = await supabase
    .from("projects")
    .select("count", { count: "exact", head: true })
  
  if (pError) {
    console.error("Projects table error:", JSON.stringify(pError, null, 2))
  } else {
    console.log("Projects count:", projects)
  }

  // Check tasks table
  console.log("\n--- Tasks ---")
  const { data: tasks, error: tError } = await supabase
    .from("tasks")
    .select("count", { count: "exact", head: true })
  
  if (tError) {
    console.error("Tasks table error:", JSON.stringify(tError, null, 2))
  } else {
    console.log("Tasks count:", tasks)
  }

  // Check profiles table (referenced in queries)
  console.log("\n--- Profiles ---")
  const { data: profiles, error: profError } = await supabase
    .from("profiles")
    .select("count", { count: "exact", head: true })
  
  if (profError) {
    console.error("Profiles table error:", JSON.stringify(profError, null, 2))
  } else {
    console.log("Profiles count:", profiles)
  }

  // Try to fetch one project to check foreign keys
  console.log("\n--- Sample Project with Profile ---")
  const { data: sampleProject, error: sPError } = await supabase
    .from("projects")
    .select("*, created_by_profile:profiles!projects_created_by_fkey(*)")
    .limit(1)
  
  if (sPError) {
    console.error("Sample project query error:", JSON.stringify(sPError, null, 2))
  } else {
    console.log("Sample project success: found", sampleProject?.length, "projects")
  }

  // Try to fetch tasks for a project
  if (sampleProject && sampleProject.length > 0) {
    const projectId = sampleProject[0].id
    console.log(`\n--- Tasks for Project ${projectId} ---`)
    const { data: projectTasks, error: pTError } = await supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*), reporter:profiles!tasks_reporter_id_fkey(*)")
      .eq("project_id", projectId)
    
    if (pTError) {
      console.error("Project tasks query error:", JSON.stringify(pTError, null, 2))
    } else {
      console.log(`Found ${projectTasks?.length} tasks`)
    }
  }
}

diagnostic()
