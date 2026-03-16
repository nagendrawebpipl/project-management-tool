"use client"

import { CommentList } from "./comment-list"
import { CommentForm } from "./comment-form"

interface CommentAreaProps {
  taskId: string
  projectId: string
  comments: any[]
  currentUserId: string
}

export function CommentArea({ taskId, projectId, comments, currentUserId }: CommentAreaProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Discussion</h3>
        <CommentForm taskId={taskId} projectId={projectId} />
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Comments</h4>
        <CommentList 
          comments={comments} 
          currentUserId={currentUserId} 
          projectId={projectId} 
        />
      </div>
    </div>
  )
}
