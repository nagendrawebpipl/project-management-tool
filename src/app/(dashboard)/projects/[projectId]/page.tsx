import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getProject } from "@/features/projects/queries"
import { getTasksByProject } from "@/features/tasks/queries"
import { getOrganizationMembers } from "@/features/organizations/queries"
import { ProjectHeader } from "@/features/projects/components/project-header"
import { canEditProject, canDeleteProject } from "@/lib/permissions"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskArea } from "@/features/tasks/components/task-area"
import { KanbanBoard } from "@/features/tasks/components/kanban/kanban-board"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"

interface ProjectDetailPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { organization, role: userRole } = await getCurrentOrganization()
  const { projectId } = await params

  const [project, tasks, members] = await Promise.all([
    getProject(projectId),
    getTasksByProject(projectId),
    getOrganizationMembers(organization.id),
  ])

  if (!project || (project as any).organization_id !== organization.id) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <ProjectHeader 
          project={project} 
          canEdit={canEditProject(userRole)} 
          canDelete={canDeleteProject(userRole)} 
        />
        <Button variant="outline" size="sm">
          <Link href={`/projects/${projectId}/board`} className="flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Fullscreen Board
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <TaskArea
            tasks={tasks as any}
            members={members as any}
            projectId={projectId}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="board" className="pt-4 h-[calc(100vh-350px)]">
           <KanbanBoard initialTasks={tasks} projectId={projectId} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">About this project</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {(project as any).description || "No description provided."}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Project Members</h3>
            <div className="space-y-4">
              {(members as any[]).map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {(member.profile?.full_name as string)?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{member.profile?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{member.profile?.email}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Project Activity</h3>
            <div className="bg-muted/50 rounded-md p-8 text-center text-sm text-muted-foreground border border-dashed">
              Activity timeline implementation coming soon
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
