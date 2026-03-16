"use client"

import { AttachmentList } from "./attachment-list"
import { AttachmentUpload } from "./attachment-upload"

interface AttachmentAreaProps {
  taskId: string
  projectId: string
  attachments: any[]
}

export function AttachmentArea({ taskId, projectId, attachments }: AttachmentAreaProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Attachments</h3>
        <AttachmentUpload taskId={taskId} projectId={projectId} />
      </div>
      <AttachmentList 
        attachments={attachments} 
        projectId={projectId} 
      />
    </div>
  )
}
