import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "@/types"

interface TaskStatusBadgeProps {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const variants: Record<TaskStatus, string> = {
    todo: "bg-slate-500/10 text-slate-600 border-slate-500/10",
    in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/10",
    review: "bg-purple-500/10 text-purple-600 border-purple-500/10",
    done: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
  }

  const dotColors: Record<TaskStatus, string> = {
    todo: "bg-slate-500",
    in_progress: "bg-blue-500",
    review: "bg-purple-500",
    done: "bg-emerald-500",
  }

  const labels: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-transparent shadow-soft",
        variants[status]
      )}
    >
      <div className={cn("size-1.5 rounded-full mr-1.5", dotColors[status])} />
      {labels[status]}
    </Badge>
  )
}

import { cn } from "@/lib/utils"
