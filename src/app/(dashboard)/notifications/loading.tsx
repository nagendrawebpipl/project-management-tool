import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="bg-white rounded-xl border p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4 items-start py-4 border-b last:border-0">
             <Skeleton className="h-10 w-10 rounded-full shrink-0" />
             <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-20" />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
