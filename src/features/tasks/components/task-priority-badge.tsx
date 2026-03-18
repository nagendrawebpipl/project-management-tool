import { Badge } from "@/components/ui/badge"
import { TaskPriority } from "@/types"

interface TaskPriorityBadgeProps {
  priority: TaskPriority
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const variants: Record<TaskPriority, string> = {
    low: "bg-blue-500/10 text-blue-600 border-blue-500/10",
    medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/10",
    high: "bg-orange-500/10 text-orange-600 border-orange-500/10",
    critical: "bg-red-500/10 text-red-600 border-red-500/10",
  }

  const dotColors: Record<TaskPriority, string> = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-transparent shadow-soft capitalize",
        variants[priority]
      )}
    >
      <div className={cn("size-1.5 rounded-full mr-1.5", dotColors[priority])} />
      {priority}
    </Badge>
  )
}

import { cn } from "@/lib/utils"
