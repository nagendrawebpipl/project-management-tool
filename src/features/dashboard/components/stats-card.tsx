import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  iconColorClass: string
  iconBgClass: string
  description?: string
}

export function StatsCard({ title, value, icon: Icon, iconColorClass, iconBgClass, description }: StatsCardProps) {
  return (
    <Card className="hover:border-foreground/40 transition-all duration-300 border-border/60 bg-card/60 shadow-sm relative overflow-hidden group">
       <div className={cn("absolute top-0 left-0 w-1 h-full opacity-20 group-hover:opacity-100 transition-opacity", iconBgClass)} />
      <CardContent className="p-8 flex items-center gap-8">
        <div className={cn("h-14 w-14 rounded-md flex items-center justify-center flex-shrink-0 border shadow-sm", iconBgClass)}>
          <Icon className={cn("h-7 w-7", iconColorClass)} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80 font-mono mb-2">{title}</p>
          <p className="text-4xl lg:text-5xl font-extrabold tracking-tighter font-mono">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground/60 mt-3 font-mono uppercase tracking-tight">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
