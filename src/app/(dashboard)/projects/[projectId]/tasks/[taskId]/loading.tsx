import { Skeleton } from "@/components/ui/skeleton"

export default function TaskDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <Skeleton className="h-4 w-32" /> { /* Back link */ }
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-4">
             <Skeleton className="h-10 w-3/4" />
             <Skeleton className="h-32 w-full" />
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 border-b">
               {[...Array(3)].map((_, i) => (
                 <Skeleton key={i} className="h-10 w-24" />
               ))}
            </div>
            <div className="bg-white rounded-xl border p-6 h-[400px]">
               <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-xl border p-6 space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-4" />
           </div>
        </div>
      </div>
    </div>
  )
}
