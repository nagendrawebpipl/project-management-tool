import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"

interface OverdueTasksWidgetProps {
  tasks: any[]
}

export function OverdueTasksWidget({ tasks }: OverdueTasksWidgetProps) {
  return (
    <Card className="h-full border-none bg-card shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6 space-y-0">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          Upcoming Deadlines
        </CardTitle>
        <Link href="/tasks" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm italic text-muted-foreground font-medium">No upcoming deadlines found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.project_id}/tasks/${task.id}`}
                className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">{task.projects?.name}</p>
                </div>
                <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">
                  {format(new Date(task.due_date), "MMM d")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
