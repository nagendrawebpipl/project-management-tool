import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Briefcase } from "lucide-react"
import Link from "next/link"

interface ProjectSummaryWidgetProps {
  projects: any[]
}

export function ProjectSummaryWidget({ projects }: ProjectSummaryWidgetProps) {
  return (
    <Card className="h-full border-border/60 bg-card/60 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 space-y-0">
        <CardTitle className="text-base font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
          Active Projects
        </CardTitle>
        <Briefcase className="h-5 w-5 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="pb-10 px-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/40 rounded-md">
            <p className="text-base text-muted-foreground/60">No active projects found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between group/item border-b border-border/30 pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1.5">
                  <p className="text-base font-extrabold leading-none group-hover/item:text-primary transition-colors font-mono tracking-tight uppercase">
                    {project.name}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                    {project.status.replace("_", " ")}
                  </p>
                </div>
                <div className="h-8 w-1 bg-muted group-hover/item:bg-primary transition-colors rounded-full" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
