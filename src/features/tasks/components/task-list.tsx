"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TaskStatusBadge } from "./task-status-badge"
import { TaskPriorityBadge } from "./task-priority-badge"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TaskList({ tasks, onTaskClick }: { tasks: any[], onTaskClick?: (task: any) => void }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No tasks found for this project.</p>
        <p className="text-sm text-muted-foreground">Get started by creating your first task.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick?.(task)}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{task.title}</span>
                  {task.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {task.description}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar_url} />
                      <AvatarFallback className="text-[10px]">
                        {task.assignee.full_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.full_name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {task.due_date ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(new Date(task.due_date), "MMM d, yyyy")}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
