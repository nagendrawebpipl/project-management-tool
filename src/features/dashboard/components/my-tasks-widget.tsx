import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { ClipboardList } from "lucide-react"

interface MyTasksWidgetProps {
  tasks: any[]
}

export function MyTasksWidget({ tasks }: MyTasksWidgetProps) {
  return (
    <Card className="h-full border-border/60 bg-card/60 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 space-y-0">
        <CardTitle className="text-base font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
          My Open Tasks
        </CardTitle>
        <ClipboardList className="h-5 w-5 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="pb-10 px-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/40 rounded-md">
            <p className="text-base text-muted-foreground/60">No tasks assigned to you.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.project_id}/tasks/${task.id}`}
                className="flex items-center justify-between group/item border-b border-border/30 pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1.5">
                  <p className="text-base font-extrabold leading-none group-hover/item:text-primary transition-colors font-mono tracking-tight uppercase">
                    {task.title}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{task.projects?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm">
                    {task.priority}
                  </Badge>
                  {task.due_date && (
                    <span className="text-xs font-bold text-muted-foreground/60 font-mono uppercase">
                      {format(new Date(task.due_date), "MMM d")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
