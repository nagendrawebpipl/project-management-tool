"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCheck, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { markNotificationReadAction, markAllNotificationsReadAction } from "../actions"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/empty-state"
import Link from "next/link"

interface NotificationListProps {
  notifications: any[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [items, setItems] = useState(notifications)

  async function handleMarkRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    await markNotificationReadAction(id)
  }

  async function handleMarkAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
    const result = await markAllNotificationsReadAction()
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("All notifications marked as read")
    }
  }

  const unreadCount = items.filter((n) => !n.is_read).length

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up! We'll let you know when something new happens."
        className="py-16"
      />
    )
  }

  return (
    <div className="space-y-8">
      {unreadCount > 0 && (
        <div className="flex justify-end px-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead} 
            className="h-10 px-6 rounded-2xl font-bold border-border/60 hover:bg-muted shadow-soft transition-all active:scale-95"
          >
            <CheckCheck className="h-4 w-4 mr-2 stroke-[2.5px]" />
            Mark all as read
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-6 rounded-2xl p-6 transition-all cursor-pointer relative group",
              !notification.is_read 
                ? "bg-primary/5 hover:bg-primary/10" 
                : "bg-transparent hover:bg-muted/10"
            )}
            onClick={() => {
              if (!notification.is_read) handleMarkRead(notification.id)
            }}
          >
            <div className="mt-1.5 flex-shrink-0">
              {notification.is_read ? (
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
              ) : (
                <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-4">
                <p className={cn(
                  "text-lg font-bold tracking-tight leading-tight", 
                  !notification.is_read ? "text-primary/90" : "text-foreground/80"
                )}>
                  {notification.title}
                </p>
                <span className="text-[11px] font-bold text-muted-foreground/40 whitespace-nowrap">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground/70 leading-relaxed line-clamp-2 pr-10">
                {notification.content}
              </p>
              {notification.link && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/10">
                  <Link
                    href={notification.link}
                    className="flex items-center text-[11px] font-bold text-primary/80 uppercase tracking-widest hover:text-primary transition-colors group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                    <Bell className="ml-2 h-3 w-3 group-hover/link:animate-bounce" />
                  </Link>
                </div>
              )}
            </div>
            {!notification.is_read && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="size-2 bg-primary rounded-full animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
