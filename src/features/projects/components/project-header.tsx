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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link 
            href="/projects" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="text-muted-foreground">
          Created by {project.created_by_profile?.full_name || "Unknown"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {canEdit && (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        )}
        {canDelete && (
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </Button>
        )}
      </div>
    </div>
  )
}
