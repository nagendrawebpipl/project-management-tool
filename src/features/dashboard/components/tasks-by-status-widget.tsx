import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TasksByStatusWidgetProps {
  counts: {
    todo: number
    in_progress: number
    review: number
    done: number
  }
}

export function TasksByStatusWidget({ counts }: TasksByStatusWidgetProps) {
  const stats = [
    { label: "TO DO", value: counts.todo, color: "bg-muted-foreground/30", textColor: "text-muted-foreground" },
    { label: "IN PROGRESS", value: counts.in_progress, color: "bg-blue-500", textColor: "text-blue-500" },
    { label: "REVIEW", value: counts.review, color: "bg-amber-500", textColor: "text-amber-500" },
    { label: "DONE", value: counts.done, color: "bg-emerald-500", textColor: "text-emerald-500" },
  ]

  return (
    <Card className="h-full border-border/60 bg-card/60 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 space-y-0">
        <CardTitle className="text-base font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
          Task Status Overview
        </CardTitle>
        <BarChart3 className="h-5 w-5 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="pb-10 px-8">
        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground tracking-tight font-mono">{stat.label}</span>
                <span className={cn("text-4xl font-bold font-mono tracking-tighter", stat.textColor)}>{stat.value}</span>
              </div>
              <div className="h-1 w-full bg-muted/30 overflow-hidden rounded-full">
                <div 
                  className={cn("h-full transition-all duration-500 ease-out", stat.color)}
                  style={{ width: `${Math.min(100, (stat.value / (Object.values(counts).reduce((a, b) => a + b, 0) || 1)) * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
