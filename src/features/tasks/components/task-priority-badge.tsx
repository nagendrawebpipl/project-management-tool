import { Badge } from "@/components/ui/badge"
import { TaskPriority } from "@/types"

interface TaskPriorityBadgeProps {
  priority: TaskPriority
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const variants: Record<TaskPriority, string> = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/10 border-orange-500/20",
    critical: "bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20",
  }

  return (
    <Badge variant="outline" className={variants[priority]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
