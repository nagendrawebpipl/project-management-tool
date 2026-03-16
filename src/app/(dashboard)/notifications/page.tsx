import { getAuthUser } from "@/lib/auth/get-user"
import { getNotifications } from "@/features/notifications/queries"
import { NotificationList } from "@/features/notifications/components/notification-list"

export default async function NotificationsPage() {
  const user = await getAuthUser()
  const notifications = await getNotifications(user.id)

  return (
    <div className="space-y-10 pb-20 max-w-[1200px] mx-auto">
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
        <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Notifications</h2>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
          Stay updated with comments, task changes, and mentions
        </p>
      </div>
      
      <div className="rounded-none border-2 border-border/40 bg-card/60 backdrop-blur-sm shadow-sm p-4 sm:p-10 font-mono">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  )
}
