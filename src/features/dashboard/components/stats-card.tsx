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
    <Card className="hover:shadow-card transition-all duration-500 border border-border/40 bg-card shadow-soft relative overflow-hidden group rounded-3xl">
      <CardContent className="p-8 flex flex-col justify-between h-full min-h-[180px]">
        <div className="flex items-center justify-between">
          <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft transition-transform duration-500 group-hover:scale-110", iconBgClass)}>
            <Icon className={cn("h-7 w-7", iconColorClass)} />
          </div>
          {description && (
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest bg-muted/20 px-3 py-1.5 rounded-full border border-transparent">
              {description}
            </span>
          )}
        </div>
        
        <div className="mt-8">
          <p className="text-sm font-bold text-muted-foreground/60 mb-1 tracking-tight uppercase">{title}</p>
          <p className="text-4xl font-extrabold tracking-tighter text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
