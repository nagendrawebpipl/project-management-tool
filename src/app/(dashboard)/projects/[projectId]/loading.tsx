import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> { /* Breadcrumb placeholder */ }
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex border-b gap-4">
           {[...Array(4)].map((_, i) => (
             <Skeleton key={i} className="h-10 w-24" />
           ))}
        </div>
        <div className="pt-4 space-y-6">
          <div className="flex justify-between">
             <Skeleton className="h-10 w-96" /> { /* Search/filter bar */ }
             <Skeleton className="h-10 w-32" /> { /* Add button */ }
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
