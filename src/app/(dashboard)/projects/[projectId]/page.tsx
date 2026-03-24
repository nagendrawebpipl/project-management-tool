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
import { LayoutDashboard } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
        <ProjectHeader 
          project={project} 
          canEdit={canEditProject(userRole)} 
          canDelete={canDeleteProject(userRole)} 
        />
        <div className="shrink-0">
          <Link 
            href={`/projects/${projectId}/board`} 
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-11 px-6 rounded-2xl font-bold border-border/60 hover:bg-muted shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <LayoutDashboard className="h-5 w-5 mr-3 text-primary stroke-[2.5px]" />
            Fullscreen Board
          </Link>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="flex flex-col flex-1 overflow-hidden">
        <div className="px-2 shrink-0">
          <TabsList className="bg-muted/10 p-1.5 rounded-[1.5rem] border border-border/40 h-auto gap-1">
            <TabsTrigger value="tasks" className="rounded-2xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all">Tasks</TabsTrigger>
            <TabsTrigger value="board" className="rounded-2xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all">Board</TabsTrigger>
            <TabsTrigger value="overview" className="rounded-2xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all">Overview</TabsTrigger>
            <TabsTrigger value="members" className="rounded-2xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all">Members</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-2xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all">Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks" className="flex-1 overflow-y-auto outline-none px-2 pb-10">
          <TaskArea
            tasks={tasks as any}
            members={members as any}
            projectId={projectId}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="board" className="flex-1 overflow-hidden outline-none">
          <div className="h-full w-full p-4">
            <KanbanBoard initialTasks={tasks} projectId={projectId} />
          </div>
        </TabsContent>

        <TabsContent value="overview" className="flex-1 overflow-y-auto outline-none px-2 pb-10">
          <Card className="rounded-3xl border-border/40 shadow-soft p-10 bg-card overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 group-hover:bg-primary transition-all" />
            <h3 className="text-2xl font-bold mb-6 tracking-tight text-foreground/90">About this project</h3>
            <p className="text-lg leading-relaxed text-muted-foreground/80 whitespace-pre-wrap font-medium">
              {(project as any).description || "No description provided."}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="flex-1 overflow-y-auto outline-none px-2 pb-10">
          <Card className="rounded-3xl border-border/40 shadow-soft p-10 bg-card">
            <h3 className="text-2xl font-bold mb-8 tracking-tight text-foreground/90">Project Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(members as any[]).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-5 rounded-2xl bg-muted/10 border border-border/20 hover:bg-muted/20 transition-all group">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-soft transition-transform group-hover:scale-105">
                      <AvatarImage src={member.profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {(member.profile?.full_name as string)?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-foreground/90">{member.profile?.full_name}</div>
                      <div className="text-sm font-medium text-muted-foreground/60">{member.profile?.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full px-4 py-1.5 border-none bg-muted/30 text-muted-foreground font-bold text-[10px] uppercase tracking-widest leading-none">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="flex-1 overflow-y-auto outline-none px-2 pb-10">
          <Card className="rounded-3xl border-border/40 shadow-soft p-10 bg-card">
            <h3 className="text-2xl font-bold mb-8 tracking-tight text-foreground/90">Project Activity</h3>
            <div className="bg-muted/10 rounded-[2rem] p-20 text-center border-2 border-dashed border-border/40 transition-all hover:bg-muted/20 group">
              <div className="size-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="size-8 text-muted-foreground/40" />
              </div>
              <p className="text-base font-bold text-muted-foreground/60 tracking-tight">Activity timeline implementation coming soon</p>
              <p className="text-sm font-medium text-muted-foreground/40 mt-1">We&apos;re building something great for you.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
