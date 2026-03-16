"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ActivityLog {
  id: string
  action: string
  entity_type: string
  created_at: string
  metadata: any
  actor: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface ActivityTimelineProps {
  activities: ActivityLog[]
  className?: string
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    )
  }

  return (
    <div className={cn("relative space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-muted pb-4", className)}>
      {activities.map((activity) => (
        <div key={activity.id} className="relative flex gap-4 pr-4">
          <Avatar className="h-10 w-10 border-2 border-background z-10 shrink-0">
            <AvatarImage src={activity.actor?.avatar_url || ""} />
            <AvatarFallback>
              {activity.actor?.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col gap-1 pt-1 overflow-hidden">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-medium text-sm">
                {activity.actor?.full_name || "Unknown User"}
              </span>
              <span className="text-sm text-muted-foreground">
                {renderActionDescription(activity)}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </span>
            
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-1 p-2 rounded bg-muted/50 text-[11px] font-mono whitespace-pre-wrap break-all border overflow-hidden">
                    {JSON.stringify(activity.metadata, null, 2)}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function renderActionDescription(activity: ActivityLog) {
  const { action, metadata } = activity
  
  switch (action) {
    case "create_task":
      return "created this task"
    case "update_task":
      if (metadata?.status) {
          return `changed status to ${metadata.status}`
      }
      if (metadata?.priority) {
          return `changed priority to ${metadata.priority}`
      }
      if (metadata?.assignee_id) {
          return "reassigned this task"
      }
      return "updated task details"
    case "move_task":
        return `moved task to ${metadata?.new_status || "a new position"}`
    case "add_comment":
        return "commented"
    case "upload_attachment":
        return `uploaded ${metadata?.file_name || "an attachment"}`
    default:
      return action.replace(/_/g, " ")
  }
}
