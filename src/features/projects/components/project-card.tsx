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
      <Card className="hover:border-foreground/40 transition-all duration-300 cursor-pointer h-full border-border/60 bg-card/60 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-8 px-8">
          <CardTitle className="text-xl font-extrabold truncate pr-2 uppercase tracking-tighter font-mono">
            {project.name}
          </CardTitle>
          <ProjectStatusBadge status={project.status} />
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <CardDescription className="line-clamp-2 mb-8 h-12 text-sm leading-relaxed font-medium text-muted-foreground/80">
            {project.description || "No description provided."}
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold font-mono text-muted-foreground/60 uppercase tracking-[0.2em]">
              Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </div>
            <div className="h-0.5 flex-1 bg-border/20 mx-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
