import { Button } from "@/components/ui/button"
import { ProjectStatusBadge } from "./project-status-badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface ProjectHeaderProps {
  project: any
  canEdit: boolean
  canDelete: boolean
}

export function ProjectHeader({ project, canEdit, canDelete }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between w-full">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/projects" 
            className="group flex size-10 items-center justify-center rounded-2xl bg-muted/20 border border-border/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-sm font-medium text-muted-foreground/80">
              Owned by <span className="text-primary/90">{project.created_by_profile?.full_name || "Unknown"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {canEdit && (
          <Button variant="outline" size="sm" className="h-10 px-5 rounded-2xl font-bold border-border/60 hover:bg-muted shadow-soft transition-all active:scale-95">
            <Edit className="mr-2 h-4 w-4 stroke-[2.5px]" />
            Edit
          </Button>
        )}
        {canDelete && (
          <Button variant="destructive" size="sm" className="h-10 px-5 rounded-2xl font-bold shadow-soft transition-all active:scale-95">
            <Trash2 className="mr-2 h-4 w-4 stroke-[2.5px]" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
