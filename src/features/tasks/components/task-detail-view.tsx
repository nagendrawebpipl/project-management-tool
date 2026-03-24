"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MetadataSidebar } from "./metadata-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { updateTaskAction, deleteTaskAction } from "../actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentList } from "@/features/comments/components/comment-list"
import { CommentForm } from "@/features/comments/components/comment-form"
import { AttachmentList } from "@/features/attachments/components/attachment-list"
import { AttachmentUpload } from "@/features/attachments/components/attachment-upload"
import { ActivityTimeline } from "@/features/activity/components/activity-timeline"
import { MessageSquare, Paperclip, Activity } from "lucide-react"

interface TaskDetailViewProps {
  task: any
  members: any[]
  comments: any[]
  attachments: any[]
  activities: any[]
  currentUser: any
  canEdit: boolean
  canDelete: boolean
}

export function TaskDetailView({ 
    task, 
    members, 
    comments, 
    attachments, 
    activities, 
    currentUser,
    canEdit, 
    canDelete 
}: TaskDetailViewProps) {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")

  async function handleUpdateTitle() {
    if (!canEdit || title === task.title) return
    try {
      const result = await updateTaskAction(task.id, { title })
      if (result.error) {
        toast.error(result.error)
        setTitle(task.title)
      } else {
        toast.success("Title updated")
      }
    } finally {
    }
  }

  async function handleUpdateDescription() {
    if (!canEdit || description === (task.description || "")) return
    try {
      const result = await updateTaskAction(task.id, { description })
      if (result.error) {
        toast.error(result.error)
        setDescription(task.description || "")
      } else {
        toast.success("Description updated")
      }
    } finally {
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteTaskAction(task.id, task.project_id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Task deleted")
        router.push(`/projects/${task.project_id}`)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href={`/projects/${task.project_id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Link>
        
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete Task
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            {canEdit ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                className="text-2xl font-bold bg-transparent border-transparent px-0 hover:border-input focus:border-input transition-all h-auto py-1"
              />
            ) : (
              <h1 className="text-2xl font-bold">{task.title}</h1>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Description</h3>
            {canEdit ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdateDescription}
                placeholder="Add a detailed description..."
                className="min-h-[200px] bg-card p-4 resize-none"
              />
            ) : (
              <div className="bg-card p-4 rounded-md border text-sm whitespace-pre-wrap min-h-[100px]">
                {task.description || <span className="italic text-muted-foreground">No description provided.</span>}
              </div>
            )}
          </div>

          <div className="pt-8 border-t">
              <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="comments" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comments ({comments.length})
                      </TabsTrigger>
                      <TabsTrigger value="attachments" className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          Attachments ({attachments.length})
                      </TabsTrigger>
                      <TabsTrigger value="activity" className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Activity
                      </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comments" className="space-y-6 pt-6">
                      <CommentList 
                          comments={comments} 
                          currentUserId={currentUser.id}
                          projectId={task.project_id}
                      />
                      <div className="pt-6 border-t">
                          <h4 className="text-sm font-semibold mb-4">Add a comment</h4>
                          <CommentForm taskId={task.id} projectId={task.project_id} />
                      </div>
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="space-y-6 pt-6">
                      <AttachmentList 
                          attachments={attachments} 
                          currentUserId={currentUser.id}
                          projectId={task.project_id}
                      />
                      <div className="pt-6 border-t">
                          <AttachmentUpload taskId={task.id} projectId={task.project_id} />
                      </div>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="pt-6">
                      <ActivityTimeline activities={activities} />
                  </TabsContent>
              </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 sticky top-24">
            <MetadataSidebar task={task} members={members} canEdit={canEdit} />
          </div>
        </div>
      </div>
    </div>
  )
}
