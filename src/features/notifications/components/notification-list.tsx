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
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-muted-foreground hover:text-foreground">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {items.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-4 rounded-xl border p-4 transition-colors cursor-pointer hover:bg-accent/50",
              !notification.is_read && "bg-blue-50 border-blue-100"
            )}
            onClick={() => {
              if (!notification.is_read) handleMarkRead(notification.id)
            }}
          >
            <div className="mt-1">
              {notification.is_read ? (
                <Circle className="h-2 w-2 fill-muted text-muted" />
              ) : (
                <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold", !notification.is_read && "text-blue-900")}>
                {notification.title}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {notification.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {notification.link && (
              <Link
                href={notification.link}
                className="text-xs text-blue-600 hover:underline whitespace-nowrap mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
