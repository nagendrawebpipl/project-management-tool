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
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
          <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Team Management</h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
            Manage permissions and access for <span className="text-primary">{organization.name}</span>
          </p>
        </div>
        {canManage && (
          <InviteMemberDialog orgId={organization.id} />
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80 font-mono">Members ({members.length})</h3>
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
