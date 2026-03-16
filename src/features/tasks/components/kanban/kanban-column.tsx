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
    <div className="flex flex-col gap-4 min-w-[300px] w-full bg-muted/30 rounded-xl p-4 border h-full min-h-[500px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{statusLabels[status]}</h3>
          <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div ref={setNodeRef} className="flex-1 flex flex-col gap-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} projectId={projectId} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border border-dashed rounded-lg min-h-[100px]">
            <span className="text-xs text-muted-foreground">No tasks</span>
          </div>
        )}
      </div>
    </div>
  )
}
