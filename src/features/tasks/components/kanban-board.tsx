"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { TASK_STATUSES } from "@/constants"
import { updateTaskPositionAction } from "../actions"
import { toast } from "sonner"

interface KanbanBoardProps {
  tasks: any[]
  projectId: string
}

export function KanbanBoard({ tasks: initialTasks, projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<any>(null)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"
    const isOverAColumn = over.data.current?.type === "Column"

    if (!isActiveATask) return

    // 1. Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status
          return arrayMove(tasks, activeIndex, overIndex)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    // 2. Dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        tasks[activeIndex].status = overId as string
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeIndex = tasks.findIndex((t) => t.id === activeId)
    const task = tasks[activeIndex]
    const columnTasks = tasks.filter((t) => t.status === task.status)
    const position = columnTasks.findIndex((t) => t.id === activeId)

    // Call server action to persist
    const result = await updateTaskPositionAction(
      activeId as string,
      projectId,
      task.status,
      position
    )

    if (result.error) {
      toast.error("Failed to update task position")
      setTasks(initialTasks) // Rollback
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status.value}
            status={status.value}
            label={status.label}
            tasks={tasks.filter((task) => task.status === status.value)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
