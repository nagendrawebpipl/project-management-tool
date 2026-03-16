"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskPriorityBadge } from "./task-priority-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
  task: any
}

export function KanbanCard({ task }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-muted rounded-lg border-2 border-primary h-[100px]"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-card p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
            {task.title}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <TaskPriorityBadge priority={task.priority} />
          
          {task.assignee ? (
            <Avatar className="h-5 w-5">
              <AvatarImage src={task.assignee.avatar_url} />
              <AvatarFallback className="text-[8px]">
                {task.assignee.full_name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground/50 bg-muted/50" />
          )}
        </div>
      </div>
    </div>
  )
}
