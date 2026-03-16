"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteCommentAction } from "../actions"
import { toast } from "sonner"
import { useState } from "react"

interface CommentItemProps {
  comment: any
  currentUserId?: string
  projectId: string
}

export function CommentItem({ comment, currentUserId, projectId }: CommentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const isOwner = currentUserId === comment.user_id

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this comment?")) return
        
        setIsDeleting(true)
        try {
            const result = await deleteCommentAction(comment.id, projectId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Comment deleted")
            }
        } catch (error) {
            toast.error("Failed to delete comment")
        } finally {
            setIsDeleting(false)
        }
    }

  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-card group">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.user?.avatar_url || ""} />
        <AvatarFallback>
            {comment.user?.full_name?.charAt(0) || "?"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
                {comment.user?.full_name || "Unknown User"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {isOwner && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
          )}
        </div>
        
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {comment.content}
        </p>
      </div>
    </div>
  )
}
