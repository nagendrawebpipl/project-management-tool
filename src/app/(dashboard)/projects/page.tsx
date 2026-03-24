import { getCurrentOrganization } from "@/lib/auth/get-organization"
export const dynamic = "force-dynamic"
import { getProjects } from "@/features/projects/queries"
import { ProjectList } from "@/features/projects/components/project-list"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"
import { canCreateProject } from "@/lib/permissions"

export default async function ProjectsPage() {
  const { organization, role } = await getCurrentOrganization()
  const projects = await getProjects(organization.id)

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between px-2">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
          <h2 className="text-4xl font-bold tracking-tight text-foreground">Projects</h2>
          <p className="text-sm font-medium text-muted-foreground/80 mt-1">
            Build and manage your <span className="text-primary/90 font-semibold">{organization.name}</span> projects.
          </p>
        </div>
        {canCreateProject(role) && <CreateProjectDialog />}
      </div>

      <ProjectList projects={projects} />
    </div>
  )
}
