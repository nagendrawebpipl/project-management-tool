"use server"

import { createClient } from "@/lib/supabase/server"
import { organizationSchema, inviteMemberSchema, updateMemberRoleSchema, updateOrganizationSchema, type OrganizationValues, type InviteMemberValues, type UpdateMemberRoleValues, type UpdateOrganizationValues } from "./schemas"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { canManageMembers } from "@/lib/permissions"
import { type UserRole } from "@/types"
import { getAuthUser } from "@/lib/auth/get-user"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createOrganizationAction(values: OrganizationValues) {
  try {
    const user = await getAuthUser()
    const validatedFields = organizationSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Invalid fields" }
    }

    const { name, slug } = validatedFields.data
    const supabase = (await createClient()) as any

    // 1. Create Organization
    const { data: org, error: orgError } = await (supabase
      .from("organizations")
      .insert({
        name,
        slug,
        owner_id: user.id,
      } as any)
      .select()
      .single() as any)

    if (orgError) {
      if (orgError.code === "23505") {
        return { error: "Slug already exists" }
      }
      return { error: orgError.message }
    }

    // 2. Create Owner Membership
    // Use regular supabase client first (fix requires RLS policy)
    const { error: memberError } = await (supabase
      .from("organization_members")
      .insert({
        organization_id: (org as any).id,
        user_id: user.id,
        role: "owner",
        status: "active",
      } as any) as any)

    if (memberError) {
      console.error("Membership creation error:", memberError)
      // If membership fails, the organization is created but user isn't a member.
      // This is usually due to RLS policies.
      return { error: `Organization created, but failed to add you as a member: ${memberError.message}. Please check RLS policies.` }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    console.error("Create organization action error:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function inviteMemberAction(orgId: string, values: InviteMemberValues) {
  const { role: userRole } = await getCurrentOrganization()
  if (!canManageMembers(userRole as UserRole)) {
    return { error: "Unauthorized" }
  }

  const validatedFields = inviteMemberSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const supabase = (await createClient()) as any

  // MVP: find existing user by email
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  if (usersError) return { error: usersError.message }

  const userToAdd = usersData.users.find((u: any) => u.email?.toLowerCase() === validatedFields.data.email.toLowerCase())
  if (!userToAdd) {
    return { error: "User not found. Only existing users can be invited in this MVP." }
  }

  // Check if already a member
  const { data: existing } = await (supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", orgId)
    .eq("user_id", userToAdd.id)
    .single() as any)

  if (existing) {
    return { error: "User is already a member of this organization." }
  }

  const { error: insertError } = await (supabase
    .from("organization_members")
    .insert({
      organization_id: orgId,
      user_id: userToAdd.id,
      role: validatedFields.data.role,
      status: "active",
    } as any) as any)

  if (insertError) return { error: insertError.message }

  revalidatePath(`/team`)
  return { success: true }
}

export async function updateMemberRoleAction(orgId: string, values: UpdateMemberRoleValues) {
  const { role: userRole } = await getCurrentOrganization()
  if (!canManageMembers(userRole as UserRole)) return { error: "Unauthorized" }

  const validatedFields = updateMemberRoleSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const supabase = (await createClient()) as any

  const { error } = await (supabase
    .from("organization_members")
    .update({ role: validatedFields.data.role } as any)
    .eq("id", validatedFields.data.memberId)
    .eq("organization_id", orgId) as any)

  if (error) return { error: error.message }

  revalidatePath(`/team`)
  return { success: true }
}

export async function removeMemberAction(orgId: string, memberId: string) {
  const { role: userRole } = await getCurrentOrganization()
  if (!canManageMembers(userRole as UserRole)) return { error: "Unauthorized" }

  const supabase = (await createClient()) as any

  const { error } = await (supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId)
    .eq("organization_id", orgId) as any)

  if (error) return { error: error.message }

  revalidatePath(`/team`)
  return { success: true }
}

export async function updateOrganizationAction(orgId: string, values: UpdateOrganizationValues) {
  const { role: userRole } = await getCurrentOrganization()
  
  // Only owner or admin can update org settings
  if (userRole !== "owner" && userRole !== "admin") {
    return { error: "Unauthorized. Only owners and admins can update organization settings." }
  }

  const validatedFields = updateOrganizationSchema.safeParse(values)
  if (!validatedFields.success) return { error: "Invalid fields" }

  const supabase = (await createClient()) as any

  const { error } = await (supabase
    .from("organizations")
    .update({ name: validatedFields.data.name } as any)
    .eq("id", orgId) as any)

  if (error) return { error: error.message }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}
