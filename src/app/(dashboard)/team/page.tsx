import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getOrganizationMembers } from "@/features/organizations/queries"
import { TeamMemberList } from "@/features/organizations/components/team-member-list"
import { InviteMemberDialog } from "@/features/organizations/components/invite-member-dialog"
import { canManageMembers } from "@/lib/permissions"
import { UserRole } from "@/types"

export default async function TeamPage() {
  const { organization, role } = await getCurrentOrganization()
  const members = await getOrganizationMembers(organization.id)
  
  const canManage = canManageMembers(role as UserRole)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            View and manage the people who have access to <span className="font-semibold text-foreground">{organization.name}</span>.
          </p>
        </div>
        {canManage && (
          <InviteMemberDialog orgId={organization.id} />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Members ({members.length})</h3>
        </div>
        <TeamMemberList 
          members={members} 
          orgId={organization.id} 
          currentUserRole={role} 
        />
      </div>
    </div>
  )
}
