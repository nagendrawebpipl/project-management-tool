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
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead} 
            className="text-[10px] font-bold uppercase tracking-widest font-mono border-2 h-9 px-6 rounded-none hover:bg-primary/10 transition-all"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-5 rounded-none border-2 p-6 transition-all cursor-pointer relative group",
              !notification.is_read 
                ? "bg-primary/5 border-primary/30" 
                : "bg-transparent border-border/40 hover:border-primary/20 hover:bg-muted/10"
            )}
            onClick={() => {
              if (!notification.is_read) handleMarkRead(notification.id)
            }}
          >
            {!notification.is_read && (
              <div className="absolute left-0 top-0 w-1.5 h-full bg-primary" />
            )}
            <div className="mt-1.5 flex-shrink-0">
              {notification.is_read ? (
                <div className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/30" />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-lg font-extrabold tracking-tight mb-1 uppercase font-mono leading-none", 
                !notification.is_read ? "text-primary" : "text-foreground/80"
              )}>
                {notification.title}
              </p>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2">
                {notification.content}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/20">
                <span className="text-[10px] font-bold font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
                {notification.link && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-border/40" />
                    <Link
                      href={notification.link}
                      className="text-[10px] font-bold font-mono text-primary uppercase tracking-[0.2em] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Access Entry_
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
