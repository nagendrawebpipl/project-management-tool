import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "MISSING",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "MISSING",
      role: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "MISSING",
      appUrl: process.env.NEXT_PUBLIC_APP_URL ? "present" : "MISSING",
    },
    checks: {}
  }

  try {
    const supabase = await createClient()
    diagnostics.checks.supabaseClient = "OK"
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    diagnostics.checks.session = sessionError ? `ERROR: ${sessionError.message}` : session ? "PRESENT" : "NULL"
    
    const { data: userData, error: userError } = await supabase.auth.getUser()
    diagnostics.checks.user = userError ? `ERROR: ${userError.message}` : userData?.user ? "OK" : "NONE"
  } catch (e: any) {
    diagnostics.checks.error = e.message || "Unknown error during initialization"
    diagnostics.checks.stack = e.stack
  }

  return NextResponse.json(diagnostics)
}
