import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 border border-border/60 bg-muted/20 rounded-lg",
      className
    )}>
      <div className="bg-background border shadow-sm p-4 rounded-md mb-6 transition-transform hover:scale-105 duration-300">
        <Icon className="h-6 w-6 text-foreground/70" />
      </div>
      <h3 className="text-sm font-bold tracking-tighter uppercase font-mono">{title}</h3>
      <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-8 h-8 px-4 text-xs font-bold uppercase tracking-widest" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
