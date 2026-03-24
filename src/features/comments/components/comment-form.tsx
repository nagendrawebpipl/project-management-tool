"use client"

import { createCommentSchema, CreateCommentInput } from "../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { addCommentAction } from "../actions"
import { toast } from "sonner"
import { useState } from "react"
import { Send } from "lucide-react"

interface CommentFormProps {
  taskId: string
  projectId: string
}

export function CommentForm({ taskId, projectId }: CommentFormProps) {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(values: CreateCommentInput) {
    setIsPending(true)
    try {
      const result = await addCommentAction(taskId, projectId, values)
      if (result.error) {
        toast.error(result.error)
      } else {
        form.reset()
        toast.success("Comment added")
      }
    } catch (_error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type your comment here..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </form>
    </Form>
  )
}
