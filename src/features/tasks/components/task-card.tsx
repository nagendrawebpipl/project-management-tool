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
      <Card className="hover:border-primary/20 transition-all duration-300 cursor-pointer group shadow-soft hover:shadow-card border-border/40 bg-card">
        <CardHeader className="p-5 pb-3 pt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </div>
          <CardTitle className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-1 overflow-hidden">
              {task.assignee ? (
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={task.assignee.avatar_url} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                    {task.assignee.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/30 bg-muted/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">?</span>
                </div>
              )}
            </div>
            
            {task.due_date && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/20 text-[10px] font-semibold text-muted-foreground/80">
                <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                <span>{format(new Date(task.due_date), "MMM d")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
