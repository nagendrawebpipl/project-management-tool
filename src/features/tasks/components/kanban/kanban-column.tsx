"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { TaskStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: any[]
  projectId: string
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
}

export function KanbanColumn({ status, tasks, projectId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: "Column",
      status,
    },
  })

  return (
    <div className="flex flex-col rounded-xl border bg-muted/40 min-h-0">
      {/* Column header */}
      <div className="flex items-center justify-between p-3 border-b shrink-0">
        <span className="font-medium text-sm">{statusLabels[status]}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
          <Button variant="ghost" size="icon-sm" className="h-6 w-6">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tasks drop area */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} projectId={projectId} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center min-h-[120px]">
            <p className="text-xs text-muted-foreground">NO TASKS</p>
          </div>
        )}
      </div>
    </div>
  )
}
