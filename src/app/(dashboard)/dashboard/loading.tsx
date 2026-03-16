import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="md:col-span-2 lg:col-span-2 h-[200px]">
             <CardHeader className="pb-2">
               <Skeleton className="h-4 w-32" />
             </CardHeader>
             <CardContent>
               <Skeleton className="h-full w-full" />
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-4 h-[300px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-3 lg:col-span-3 h-[300px]">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="h-[400px]">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex gap-3">
               <Skeleton className="h-8 w-8 rounded-full" />
               <div className="flex-1 space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-3 w-24" />
               </div>
             </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
