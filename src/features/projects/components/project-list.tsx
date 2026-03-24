import { Briefcase } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { ProjectCard } from "./project-card"

interface ProjectListProps {
  projects: any[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No projects found"
        description="You haven&apos;t created any projects yet. Start by creating your first project to manage your tasks."
        className="min-h-[400px]"
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
