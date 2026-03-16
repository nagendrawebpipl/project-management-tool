import { getAuthUser } from "@/lib/auth/get-user"
import { getNotifications } from "@/features/notifications/queries"
import { NotificationList } from "@/features/notifications/components/notification-list"

export default async function NotificationsPage() {
  const user = await getAuthUser()
  const notifications = await getNotifications(user.id)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with comments, task changes, and mentions.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  )
}
