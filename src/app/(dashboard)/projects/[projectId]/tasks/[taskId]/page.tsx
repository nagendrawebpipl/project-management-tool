import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getTask } from "@/features/tasks/queries"
import { getOrganizationMembers } from "@/features/organizations/queries"
import { TaskDetailView } from "@/features/tasks/components/task-detail-view"
import { canEditTask, canDeleteTask } from "@/lib/permissions"
import { notFound } from "next/navigation"
import { getCommentsByTask } from "@/features/comments/queries"
import { getAttachmentsByTask } from "@/features/attachments/queries"
import { getActivityByEntity } from "@/features/activity/queries"
import { getAuthUser } from "@/lib/auth/get-user"

interface TaskPageProps {
  params: Promise<{
    projectId: string
    taskId: string
  }>
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { organization, role } = await getCurrentOrganization()
  const { taskId } = await params

  const [task, members, comments, attachments, activities, currentUser] = await Promise.all([
    getTask(taskId),
    getOrganizationMembers(organization.id),
    getCommentsByTask(taskId),
    getAttachmentsByTask(taskId),
    getActivityByEntity("task", taskId),
    getAuthUser()
  ])

  if (!task || (task as any).organization_id !== organization.id) {
    notFound()
  }

  return (
    <TaskDetailView 
      task={task} 
      members={members} 
      comments={comments}
      attachments={attachments}
      activities={activities}
      currentUser={currentUser as any}
      canEdit={canEditTask(role)} 
      canDelete={canDeleteTask(role)} 
    />
  )
}
