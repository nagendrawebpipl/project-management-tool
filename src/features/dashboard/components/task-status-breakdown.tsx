import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskStatusBreakdownProps {
  tasksByStatus: {
    todo: number
    in_progress: number
    in_review: number
    done: number
  }
  total: number
}

const statusConfig = [
  { key: "todo", label: "To Do", color: "bg-slate-400", textColor: "text-slate-600" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-500", textColor: "text-blue-600" },
  { key: "in_review", label: "In Review", color: "bg-amber-500", textColor: "text-amber-600" },
  { key: "done", label: "Done", color: "bg-emerald-500", textColor: "text-emerald-600" },
]

export function TaskStatusBreakdown({ tasksByStatus, total }: TaskStatusBreakdownProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-500" />
          Task Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No tasks yet.</p>
        ) : (
          <>
            {/* Stacked bar */}
            <div className="h-3 w-full rounded-full flex overflow-hidden gap-0.5">
              {statusConfig.map(({ key, color }) => {
                const value = tasksByStatus[key as keyof typeof tasksByStatus]
                const pct = total > 0 ? (value / total) * 100 : 0
                if (pct === 0) return null
                return (
                  <div
                    key={key}
                    className={cn("h-full transition-all", color)}
                    style={{ width: `${pct}%` }}
                    title={`${key}: ${value}`}
                  />
                )
              })}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {statusConfig.map(({ key, label, color, textColor }) => {
                const value = tasksByStatus[key as keyof typeof tasksByStatus]
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", color)} />
                    <span className="text-xs text-muted-foreground flex-1">{label}</span>
                    <span className={cn("text-xs font-semibold", textColor)}>
                      {value} <span className="text-muted-foreground font-normal">({pct}%)</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
