import { Skeleton } from "@/components/ui/skeleton"

export default function BoardLoading() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
         <Skeleton className="h-9 w-48" />
         <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
         </div>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-hidden pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-80 shrink-0 flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
               <Skeleton className="h-6 w-24" />
               <Skeleton className="h-6 w-8" />
             </div>
             <div className="flex-1 bg-slate-50 rounded-xl p-2 space-y-3">
                {[...Array(3)].map((_, j) => (
                   <div key={j} className="h-24 bg-white border rounded-lg p-3 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex justify-between pt-2">
                         <Skeleton className="h-4 w-4 rounded-full" />
                         <Skeleton className="h-4 w-12" />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
