"use client"

import { FileIcon, ImageIcon, FileTextIcon, DownloadIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteAttachmentAction } from "../actions"
import { toast } from "sonner"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AttachmentListProps {
  attachments: any[]
  currentUserId?: string
  projectId: string
}

export function AttachmentList({ attachments, currentUserId, projectId }: AttachmentListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this attachment?")) return
    setIsDeleting(id)
    try {
      const result = await deleteAttachmentAction(id, projectId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Attachment deleted")
      }
    } catch (error) {
      toast.error("Failed to delete attachment")
    } finally {
      setIsDeleting(null)
    }
  }

  async function handleDownload(path: string, fileName: string) {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from("task-attachments")
      .download(path)

    if (error) {
        toast.error("Failed to download file")
        return
    }

    const url = URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground font-medium">No attachments yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="group p-3 border rounded-lg bg-card hover:border-primary transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              {getIconForType(attachment.file_type)}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate" title={attachment.file_name}>
                {attachment.file_name}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {(attachment.file_size / 1024).toFixed(1)} KB • {attachment.uploader?.full_name}
              </p>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
                >
                    <DownloadIcon className="h-4 w-4" />
                </Button>
                
                {currentUserId === attachment.uploaded_by && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(attachment.id)}
                        disabled={isDeleting === attachment.id}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getIconForType(type: string) {
  if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />
  if (type.includes("pdf")) return <FileTextIcon className="h-5 w-5 text-red-500" />
  return <FileIcon className="h-5 w-5 text-gray-500" />
}
