import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TasksByPriorityWidgetProps {
  counts: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

export function TasksByPriorityWidget({ counts }: TasksByPriorityWidgetProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  
  const stats = [
    { label: "Low", value: counts.low, color: "bg-slate-200" },
    { label: "Medium", value: counts.medium, color: "bg-blue-400" },
    { label: "High", value: counts.high, color: "bg-amber-400" },
    { label: "Urgent", value: counts.urgent, color: "bg-rose-500" },
  ]

  return (
    <Card className="h-full border border-border/40 bg-card shadow-soft rounded-3xl overflow-hidden group">
      <CardHeader className="pb-4 pt-8 px-8">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground/90">
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-10 space-y-7">
        {stats.map((stat) => {
          const percentage = Math.round((stat.value / total) * 100)
          return (
            <div key={stat.label} className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                <span>{stat.label}</span>
                <span className="text-foreground/80 font-bold">{stat.value} <span className="text-[10px] opacity-60 ml-0.5">({percentage}%)</span></span>
              </div>
              <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.1)]", stat.color)}
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
