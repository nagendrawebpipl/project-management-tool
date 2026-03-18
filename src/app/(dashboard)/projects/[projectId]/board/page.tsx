import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getTasksByProject } from "@/features/tasks/queries"
import { getProject } from "@/features/projects/queries"
import { KanbanBoard } from "@/features/tasks/components/kanban/kanban-board"
import { notFound } from "next/navigation"

interface BoardPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { organization } = await getCurrentOrganization()
  const { projectId } = await params

  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getTasksByProject(projectId),
  ])

  if (!project || (project as any).organization_id !== organization.id) {
    notFound()
  }

  return (
    <div className="h-full space-y-10 pb-10">
      <div className="flex items-center justify-between px-2">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{(project as any).name}</h1>
          <p className="text-sm font-medium text-muted-foreground/80 mt-1">
            Manage your <span className="text-primary/90 font-semibold">Workflow</span> and track task progress.
          </p>
        </div>
      </div>
      
      <KanbanBoard initialTasks={tasks} projectId={projectId} />
    </div>
  )
}
