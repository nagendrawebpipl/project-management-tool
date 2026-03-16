"use client"

import { CommentItem } from "./comment-item"

interface CommentListProps {
  comments: any[]
  currentUserId?: string
  projectId: string
}

export function CommentList({ comments, currentUserId, projectId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground font-medium">No comments yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Start the conversation below!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem 
            key={comment.id} 
            comment={comment} 
            currentUserId={currentUserId}
            projectId={projectId}
        />
      ))}
    </div>
  )
}
