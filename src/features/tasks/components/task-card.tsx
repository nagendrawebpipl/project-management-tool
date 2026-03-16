import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskStatusBadge } from "./task-status-badge"
import { TaskPriorityBadge } from "./task-priority-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface TaskCardProps {
  task: any // TODO: Add DB Type
  projectId: string
}

export function TaskCard({ task, projectId }: TaskCardProps) {
  return (
    <Link href={`/projects/${projectId}/tasks/${task.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
        <CardHeader className="p-4 pb-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </div>
          <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {task.assignee ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar_url} />
                  <AvatarFallback className="text-[10px]">
                    {task.assignee.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">?</span>
                </div>
              )}
            </div>
            
            {task.due_date && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "MMM d")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
