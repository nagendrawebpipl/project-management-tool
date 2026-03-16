import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivityWidgetProps {
  activities: any[]
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  return (
    <Card className="h-full border-border/60 bg-card/60 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-1 h-full bg-muted-foreground/10 group-hover:bg-primary transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 space-y-0">
        <CardTitle className="text-base font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">
          Recent Activity
        </CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="pb-10 px-8">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/40 rounded-md">
            <p className="text-base text-muted-foreground/60">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity) => {
              const actorName = activity.actor?.full_name || "Unknown User"
              const actorAvatar = activity.actor?.avatar_url
              
              return (
                <div key={activity.id} className="flex gap-6 items-start group/item">
                  <Avatar className="h-10 w-10 rounded-md border-2 shadow-sm">
                    <AvatarImage src={actorAvatar || ""} className="object-cover" />
                    <AvatarFallback className="text-sm font-mono font-bold bg-muted/30 text-primary">
                      {actorName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                       <p className="text-sm font-bold uppercase tracking-tight font-mono text-primary">{actorName}</p>
                       <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-tighter">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      <span className="text-muted-foreground italic">{getActivityText(activity)}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getActivityText(activity: any) {
  const { action, entity_type } = activity
  
  switch(action) {
    case "create": return `created a ${entity_type}`
    case "update": return `updated a ${entity_type}`
    case "delete": return `deleted a ${entity_type}`
    case "add_comment": return "added a comment"
    case "upload_attachment": return "uploaded a file"
    default: return action.replace("_", " ")
  }
}
