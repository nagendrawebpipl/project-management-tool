"use client"

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState, useMemo } from "react"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { TaskStatus } from "@/types"
import { moveTaskAction } from "../../actions"
import { toast } from "sonner"

interface KanbanBoardProps {
  initialTasks: any[]
  projectId: string
}

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "review", "done"]

export function KanbanBoard({ initialTasks, projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<any | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, any[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    }
    tasks.forEach((task) => {
      grouped[task.status as TaskStatus]?.push(task)
    })
    return grouped
  }, [tasks])

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const data = active.data.current
    if (data?.type === "Task") {
      setActiveTask(data.task)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"
    const isOverAColumn = over.data.current?.type === "Column"

    if (!isActiveATask) return

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks]
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: newTasks[overIndex].status,
          }
          return arrayMove(newTasks, activeIndex, overIndex)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    // Dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const newStatus = over.data.current?.status

        const newTasks = [...tasks]
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          status: newStatus,
        }

        return arrayMove(newTasks, activeIndex, activeIndex)
      })
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    const overTask = tasks.find((t) => t.id === overId)
    const overColumn = COLUMNS.find((c) => c === overId)

    let newStatus: TaskStatus = activeTask.status
    let newPosition: number = activeTask.position

    const columnTasks = tasks
      .filter((t) => t.status === (overTask?.status || overColumn || activeTask.status))
      .sort((a, b) => a.position - b.position)

    const _activeIndexInCol = columnTasks.findIndex((t) => t.id === activeId)
    
    // Logic for new position calculation
    // This is a simplified version. For true nested sorting we'd need more logic.
    // We'll use the index in the filtered tasks array and interpolate.
    
    const overIndexInCol = overTask 
        ? columnTasks.findIndex((t) => t.id === overId)
        : columnTasks.length // dropped at the end of col

    newStatus = (overTask?.status || overColumn || activeTask.status) as TaskStatus
    
    // Position calc logic (Step-by-step plan: top=first-1000, bottom=last+1000, between=(a+b)/2)
    const filteredTasks = tasks.filter(t => t.status === newStatus && t.id !== activeId).sort((a,b) => a.position - b.position)
    
    if (filteredTasks.length === 0) {
        newPosition = 1000
    } else if (overIndexInCol === 0) {
        newPosition = filteredTasks[0].position - 1000
    } else if (overIndexInCol >= filteredTasks.length) {
        newPosition = filteredTasks[filteredTasks.length - 1].position + 1000
    } else {
        const prev = filteredTasks[overIndexInCol - 1]
        const next = filteredTasks[overIndexInCol]
        newPosition = (prev.position + next.position) / 2
    }

    // Persist to DB
    try {
      const result = await moveTaskAction({
        taskId: activeId as string,
        newStatus,
        newPosition,
      })

      if (result.error) {
        toast.error(result.error)
        setTasks(initialTasks) // Revert on error
      }
    } catch (_error) {
      toast.error("Failed to save task position")
      setTasks(initialTasks)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-3 p-4 h-[calc(100vh-120px)]">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            projectId={projectId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: "0.5",
            },
          },
        }),
      }}>
        {activeTask ? (
          <KanbanCard task={activeTask} projectId={projectId} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
