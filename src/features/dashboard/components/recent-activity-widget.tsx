import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivityWidgetProps {
  activities: any[]
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  return (
    <Card className="h-full border-none bg-card shadow-sm rounded-2xl">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm italic text-muted-foreground font-medium">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const actorName = activity.profiles?.full_name || "Unknown User"
              const actorAvatar = activity.profiles?.avatar_url
              
              return (
                <div key={activity.id} className="flex gap-4 items-start group">
                  <Avatar className="h-10 w-10 rounded-full border shadow-sm">
                    <AvatarImage src={actorAvatar || ""} className="object-cover" />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground uppercase">
                      {actorName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-sm font-semibold text-foreground">{actorName}</p>
                       <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-bold">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getActivityText(activity)}
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
    case "create": return `created a new ${entity_type}`
    case "update": return `updated a ${entity_type}`
    case "archive": return `archived a ${entity_type}`
    case "delete": return `deleted a ${entity_type}`
    case "add_comment": return "added a comment to a task"
    case "upload_attachment": return "uploaded a file to a task"
    case "move": return `moved a task to ${activity.metadata?.newStatus || "a new column"}`
    default: return action.replace("_", " ")
  }
}
