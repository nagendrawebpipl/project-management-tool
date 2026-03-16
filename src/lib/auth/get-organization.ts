import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "./get-user"
import { redirect } from "next/navigation"

/**
 * Gets the current organization for the authenticated user.
 * For the MVP, it returns the first organization the user is a member of.
 * If the user has no organization, they are redirected to the onboarding page.
 */
export async function getCurrentOrganization() {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { data: membership, error } = await supabase
    .from("organization_members")
    .select("*, organization:organizations!organization_id(*)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("DEBUG: getCurrentOrganization error:", error);
    throw new Error(`Failed to fetch organization membership: ${error.message} (Code: ${error.code})`);
  }

  if (!membership) {
    redirect("/onboarding")
  }

  return {
    user,
    organization: (membership as any).organization,
    organizationId: (membership as any).organization.id,
    role: (membership as any).role,
    membershipId: (membership as any).id,
  }
}
