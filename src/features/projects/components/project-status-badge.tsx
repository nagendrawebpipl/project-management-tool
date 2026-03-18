import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ProjectStatus } from "@/types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const variants: Record<ProjectStatus, string> = {
    active: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/10",
    completed: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/10",
    archived: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/10",
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-transparent shadow-soft capitalize",
        variants[status]
      )}
    >
      <div className={cn("size-1.5 rounded-full mr-2", status === 'active' ? 'bg-emerald-500' : status === 'completed' ? 'bg-blue-500' : 'bg-slate-500')} />
      {status}
    </Badge>
  )
}
