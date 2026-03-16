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
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{(project as any).name} - Board</h1>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks to manage your workflow optimally.
          </p>
        </div>
      </div>
      
      <KanbanBoard initialTasks={tasks} projectId={projectId} />
    </div>
  )
}
