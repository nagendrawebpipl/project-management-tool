"use client"

import { useState } from "react"
import { TaskStatusBadge } from "./task-status-badge"
import { TaskPriorityBadge } from "./task-priority-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AssigneePicker } from "./assignee-picker"
import { updateTaskAction } from "../actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

interface MetadataSidebarProps {
  task: any
  members: any[]
  canEdit: boolean
}

export function MetadataSidebar({ task, members, canEdit }: MetadataSidebarProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleUpdate(field: string, value: any) {
    if (!canEdit) return
    setIsUpdating(true)
    try {
      const result = await updateTaskAction(task.id, { [field]: value })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Updated")
      }
    } catch (error) {
      toast.error("Failed to update")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Status
        </label>
        {canEdit ? (
          <Select
            disabled={isUpdating}
            defaultValue={task.status}
            onValueChange={(val) => handleUpdate("status", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="pt-1">
            <TaskStatusBadge status={task.status} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Priority
        </label>
        {canEdit ? (
          <Select
            disabled={isUpdating}
            defaultValue={task.priority}
            onValueChange={(val) => handleUpdate("priority", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="pt-1">
            <TaskPriorityBadge priority={task.priority} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Assignee
        </label>
        {canEdit ? (
          <AssigneePicker 
            members={members} 
            value={task.assignee_id} 
            onChange={(val) => handleUpdate("assignee_id", val)} 
          />
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee?.avatar_url} />
              <AvatarFallback className="text-[10px]">
                {task.assignee?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{task.assignee?.full_name || "Unassigned"}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Reporter
        </label>
        <div className="flex items-center gap-2 pt-1 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.reporter?.avatar_url} />
            <AvatarFallback className="text-[10px]">
              {task.reporter?.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{task.reporter?.full_name}</span>
        </div>
      </div>

      <div className="pt-4 border-t text-[10px] text-muted-foreground space-y-1">
        <div>Created {format(new Date(task.created_at), "PPP")}</div>
        <div>Last updated {format(new Date(task.updated_at), "PPP")}</div>
      </div>
      
      {isUpdating && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving changes...
        </div>
      )}
    </div>
  )
}
