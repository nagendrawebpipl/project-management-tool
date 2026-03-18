import { getAuthUser } from "@/lib/auth/get-user"
import { getNotifications } from "@/features/notifications/queries"
import { NotificationList } from "@/features/notifications/components/notification-list"

export default async function NotificationsPage() {
  const user = await getAuthUser()
  const notifications = await getNotifications(user.id)

  return (
    <div className="space-y-12 pb-20 max-w-[1200px] mx-auto px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm font-semibold text-muted-foreground/60 mt-2">
            Stay updated with comments, task changes, and mentions
          </p>
        </div>
      </div>
      
      <div className="rounded-3xl border border-border/40 bg-card shadow-soft p-1 overflow-hidden">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  )
}
