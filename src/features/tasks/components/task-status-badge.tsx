import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "@/types"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const variants: Record<TaskStatus, string> = {
    todo: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/10 border-slate-500/20",
    in_progress: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20",
    review: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/10 border-purple-500/20",
    done: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20",
  }

  const labels: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
  }

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  )
}
