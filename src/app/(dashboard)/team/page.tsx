import { getCurrentOrganization } from "@/lib/auth/get-organization"
export const dynamic = "force-dynamic"
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
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90 font-sans">Team Management</h1>
          <p className="text-sm font-semibold text-muted-foreground/60 mt-2">
            Manage permissions and access for <span className="text-primary/80 font-bold">{organization.name}</span>
          </p>
        </div>
        {canManage && (
          <div className="bg-card p-1 rounded-2xl shadow-soft border border-border/40">
            <InviteMemberDialog orgId={organization.id} />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em] pl-1">Members ({members.length})</h3>
        </div>
        <div className="rounded-3xl border border-border/40 bg-card shadow-soft overflow-hidden">
          <TeamMemberList 
            members={members} 
            orgId={organization.id} 
            currentUserRole={role} 
          />
        </div>
      </div>
    </div>
  )
}
