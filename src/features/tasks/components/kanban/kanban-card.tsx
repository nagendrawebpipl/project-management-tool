"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskCard } from "../task-card"
import { cn } from "@/lib/utils"

interface KanbanCardProps {
  task: any
  projectId: string
  isOverlay?: boolean
}

export function KanbanCard({ task, projectId, isOverlay }: KanbanCardProps) {
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
        className="opacity-30 rounded-lg border-2 border-dashed border-primary h-[120px]"
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
        "cursor-grab active:cursor-grabbing",
        isOverlay && "opacity-90 scale-105"
      )}
    >
      <TaskCard task={task} projectId={projectId} />
    </div>
  )
}
