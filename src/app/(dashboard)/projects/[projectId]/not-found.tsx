import Link from "next/link"
import { FolderX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-background">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FolderX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Project not found</h2>
        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          The project you are looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link href="/projects" passHref>
          <Button>Back to Projects</Button>
        </Link>
      </div>
    </div>
  )
}
