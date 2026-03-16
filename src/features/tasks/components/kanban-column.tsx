"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  status: string
  label: string
  tasks: any[]
}

export function KanbanColumn({ status, label, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: "Column",
      status,
    },
  })

  return (
    <div className="flex flex-col gap-y-4 min-w-[300px] max-w-[350px] w-full bg-muted/30 rounded-xl p-4 border border-transparent hover:border-muted-foreground/10 transition-colors">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-x-2">
          <h3 className="font-semibold text-sm">{label}</h3>
          <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-y-3 flex-1 overflow-y-auto min-h-[500px] scrollbar-none",
        )}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg flex-1 h-32 flex items-center justify-center">
            <span className="text-xs text-muted-foreground italic">Drop here</span>
          </div>
        )}
      </div>
    </div>
  )
}
