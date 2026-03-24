"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  trigger: React.ReactElement
  title: string
  description: string
  onConfirm: () => Promise<void>
  isLoading?: boolean
  destructive?: boolean
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  isLoading = false,
  destructive = true
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button className="w-full text-left" />
        }
      >
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className={destructive ? "bg-red-600 hover:bg-red-700" : ""}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}