"use client"
import { TaskCard } from "./task-card"

import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateTaskForm } from "./create-task-form"
import { canCreateTask } from "@/lib/permissions"
import { useState } from "react"

interface TaskAreaProps {
  tasks: any[]
  members: any[]
  projectId: string
  userRole: any // UserRole type
}

export function TaskArea({ tasks, members, projectId, userRole }: TaskAreaProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card/50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold">No tasks found</h3>
          <p className="mt-2 text-sm text-muted-foreground mb-4">
            Get started by creating your first task for this project.
          </p>
          {canCreateTask(userRole) && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to this project.
                  </DialogDescription>
                </DialogHeader>
                <CreateTaskForm 
                  projectId={projectId} 
                  members={members} 
                  onSuccess={() => setIsOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks ({tasks.length})</h3>
        {canCreateTask(userRole) && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this project.
                </DialogDescription>
              </DialogHeader>
              <CreateTaskForm 
                projectId={projectId} 
                members={members} 
                onSuccess={() => setIsOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} projectId={projectId} />
        ))}
      </div>
    </div>
  )
}
