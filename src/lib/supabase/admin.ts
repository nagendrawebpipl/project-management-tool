import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Create a Supabase client with the service role key for admin tasks
// This bypasses RLS and should ONLY be used in server actions/handlers
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
