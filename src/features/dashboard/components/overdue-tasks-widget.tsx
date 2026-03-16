import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface OverdueTasksWidgetProps {
  tasks: any[]
}

export function OverdueTasksWidget({ tasks }: OverdueTasksWidgetProps) {
  return (
    <Card className="h-full border-border/60 bg-card/60 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 space-y-0">
        <CardTitle className="text-base font-bold uppercase tracking-[0.2em] text-red-600 font-mono">
          Overdue Tasks
        </CardTitle>
        <AlertCircle className="h-5 w-5 text-red-500/50" />
      </CardHeader>
      <CardContent className="pb-10 px-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 border border-dashed border-border/40 rounded-md">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/50 font-mono">ALL CLEAR</p>
            <p className="text-base text-muted-foreground/60">Great job! Nothing is overdue.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.project_id}/tasks/${task.id}`}
                className="flex flex-col space-y-2 group/item"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-extrabold leading-none group-hover/item:text-red-600 transition-colors font-mono tracking-tight uppercase">{task.title}</p>
                  <span className="text-sm font-bold text-red-500/80 font-mono tracking-tighter">
                    {format(new Date(task.due_date), "MMM d")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-0.5 flex-1 bg-red-500/10" />
                   <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{task.projects?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
