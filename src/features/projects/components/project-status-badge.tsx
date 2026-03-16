import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ProjectStatus } from "@/types"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const variants: Record<ProjectStatus, string> = {
    active: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20",
    archived: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/10 border-slate-500/20",
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm border-2 font-mono",
        variants[status]
      )}
    >
      {status}
    </Badge>
  )
}
