import { Skeleton } from "@/components/ui/skeleton"

export default function TeamLoading() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="rounded-md border bg-white">
          <div className="p-4 border-b flex gap-4">
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-4 w-1/4" />
             <Skeleton className="h-4 w-1/4" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0 flex items-center gap-4">
               <Skeleton className="h-10 w-10 rounded-full" />
               <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
               </div>
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
