import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getProjects } from "@/features/projects/queries"
import { ProjectList } from "@/features/projects/components/project-list"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { canCreateProject } from "@/lib/permissions"

export default async function ProjectsPage() {
  const { organization, role } = await getCurrentOrganization()
  const projects = await getProjects(organization.id)

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
          <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Projects</h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
            Manage and track projects for <span className="text-primary">{organization.name}</span>
          </p>
        </div>
        {canCreateProject(role) && <CreateProjectDialog />}
      </div>

      <ProjectList projects={projects} />
    </div>
  )
}
