import { z } from "zod"

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
})

export type OrganizationValues = z.infer<typeof organizationSchema>

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "member"]).default("member"),
})

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["admin", "manager", "member", "owner", "guest"]),
})

export type UpdateMemberRoleValues = z.infer<typeof updateMemberRoleSchema>

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
})

export type UpdateOrganizationValues = z.infer<typeof updateOrganizationSchema>
