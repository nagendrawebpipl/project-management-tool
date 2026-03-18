import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectStatusBadge } from "./project-status-badge"
import { formatDistanceToNow } from "date-fns"

interface ProjectCardProps {
  project: any // TODO: Add DB Type
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:border-primary/20 transition-all duration-500 cursor-pointer h-full border-border/40 bg-card shadow-card relative overflow-hidden group hover:shadow-premium">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/10 group-hover:bg-primary transition-all duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-8 px-8">
          <CardTitle className="text-xl font-bold truncate pr-2 text-foreground/90 tracking-tight">
            {project.name}
          </CardTitle>
          <ProjectStatusBadge status={project.status} />
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <CardDescription className="line-clamp-2 mb-8 h-12 text-sm leading-relaxed font-medium text-muted-foreground/80">
            {project.description || "No description provided."}
          </CardDescription>
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground/60">
            <div>
              {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
