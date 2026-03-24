"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AttachmentUploadProps {
  taskId: string
  projectId: string
}

export function AttachmentUpload({ taskId, projectId }: AttachmentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  async function handleUpload() {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("taskId", taskId)
    formData.append("projectId", projectId)

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Upload failed")
      } else {
        toast.success("File uploaded successfully")
        setFile(null)
        router.refresh()
      }
    } catch (_error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label htmlFor="file-upload" className="font-semibold text-sm">
          Upload Attachment
        </Label>
        {file && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFile(null)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!file ? (
        <div className="relative">
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Click to select a file</span>
            <span className="text-xs text-muted-foreground">Max size: 10MB</span>
          </Label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-card border rounded-md flex items-center justify-between">
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="text-sm font-medium truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
