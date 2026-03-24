"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
      <div className="bg-red-50 p-4 rounded-full">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected error. Don&apos;t worry, your data is safe. You can try refreshing the page or try again.
        </p>
      </div>
      <div className="flex items-center gap-4 pt-4">
        <Button onClick={() => reset()} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button onClick={() => window.location.reload()}>
          Refresh page
        </Button>
      </div>
      {error.digest && (
        <p className="text-[10px] text-muted-foreground">Error ID: {error.digest}</p>
      )}
    </div>
  )
}
