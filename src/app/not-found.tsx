import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
      <div className="bg-slate-100 p-4 rounded-full">
        <Search className="h-10 w-10 text-slate-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Page not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Whatever you're looking for doesn't seem to exist, or has been moved. 
        </p>
      </div>
      <Link 
        href="/dashboard"
        className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
