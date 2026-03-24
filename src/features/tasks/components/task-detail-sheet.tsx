"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Clock, Trash2, MessageSquare, Paperclip, Activity, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTaskAction, updateTaskAction } from "../actions"
import { toast } from "sonner"
import { TASK_STATUSES, TASK_PRIORITIES } from "@/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentArea } from "@/features/comments/components/comment-area"
import { AttachmentArea } from "@/features/attachments/components/attachment-area"
import { ActivityTimeline } from "@/features/activity/components/activity-timeline"
import { createClient } from "@/lib/supabase/client"
import { useRealtimeComments } from "@/hooks/use-realtime-comments"

export function TaskDetailSheet({
  task,
  members,
  open,
  onOpenChange,
}: {
  task: any
  members: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [comments, setComments] = useState<any[]>([])
  const [attachments, setAttachments] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [_isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const supabase = createClient()
  useRealtimeComments(task?.id)

  const getCurrentUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    setCurrentUserId(data.user?.id || null)
  }, [supabase])

  const fetchDetails = useCallback(async () => {
    if (!task?.id) return
    setIsLoading(true)
    try {
      const [commentsRes, attachmentsRes, activitiesRes] = await Promise.all([
        supabase
          .from("task_comments")
          .select("*, profiles(full_name, avatar_url)")
          .eq("task_id", task.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("task_attachments")
          .select("*")
          .eq("task_id", task.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("activity_logs")
          .select("*, profiles:actor_id(full_name, avatar_url)")
          .eq("entity_id", task.id)
          .order("created_at", { ascending: false }),
      ])

      setComments(commentsRes.data || [])
      setAttachments(attachmentsRes.data || [])
      setActivities(activitiesRes.data || [])
    } catch (error) {
      console.error("Error fetching task details:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, task?.id])

  useEffect(() => {
    if (open && task?.id) {
      fetchDetails()
      getCurrentUser()
    }
  }, [open, task?.id, fetchDetails, getCurrentUser])

  if (!task) return null

  async function handleStatusChange(status: string) {
    const result = await updateTaskAction(task.id, { status: status as any })
    if (result.error) toast.error(result.error)
    else toast.success("Status updated")
  }

  async function handlePriorityChange(priority: string) {
    const result = await updateTaskAction(task.id, { priority: priority as any })
    if (result.error) toast.error(result.error)
    else toast.success("Priority updated")
  }

  async function handleAssigneeChange(assigneeId: string) {
    const id = assigneeId === "none" ? null : assigneeId
    const result = await updateTaskAction(task.id, { assignee_id: id })
    if (result.error) toast.error(result.error)
    else toast.success("Assignee updated")
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      const result = await deleteTaskAction(task.id, task.project_id)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Task deleted")
        onOpenChange(false)
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              TASK-{task.id.substring(0, 8)}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <SheetTitle className="text-2xl font-bold leading-tight">{task.title}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="details" className="text-xs">
              <Info className="h-3 w-3 mr-2" /> Details
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-2" /> Comments
            </TabsTrigger>
            <TabsTrigger value="attachments" className="text-xs">
              <Paperclip className="h-3 w-3 mr-2" /> Files
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <Activity className="h-3 w-3 mr-2" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                <Select onValueChange={handleStatusChange} defaultValue={task.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
                <Select onValueChange={handlePriorityChange} defaultValue={task.priority}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Assignee
              </label>
              <Select onValueChange={handleAssigneeChange} defaultValue={task.assignee_id || "none"}>
                <SelectTrigger className="w-full border-none bg-muted/30 hover:bg-muted/50 focus:ring-0">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.user.id} value={m.user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={m.user.avatar_url} />
                          <AvatarFallback className="text-[10px]">
                            {m.user.full_name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{m.user.full_name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </div>
                <span className="text-sm font-medium">
                  {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <span className="text-sm font-medium">
                  {format(new Date(task.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
              <div className="rounded-lg border bg-muted/10 p-4 text-sm whitespace-pre-wrap min-h-[100px] text-slate-700">
                {task.description || "No description provided."}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <CommentArea 
              taskId={task.id} 
              projectId={task.project_id} 
              comments={comments}
              currentUserId={currentUserId!}
            />
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <AttachmentArea 
              taskId={task.id} 
              projectId={task.project_id} 
              attachments={attachments}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTimeline activities={activities} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
