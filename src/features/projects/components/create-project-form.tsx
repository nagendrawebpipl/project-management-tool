"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectValues } from "../schemas"
import { createProjectAction } from "../actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: ProjectValues) {
    setIsPending(true)
    try {
      const result = await createProjectAction(values)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Project created successfuly")
        form.reset()
        router.refresh()
        onSuccess?.()
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 font-mono">Project Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Marketing Website" 
                  className="rounded-none border-t-0 border-x-0 border-b focus-visible:ring-0 focus-visible:border-primary transition-all px-0" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-mono tracking-wider" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 font-mono">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the goals and scope of this project..." 
                  className="resize-none rounded-sm border-muted-foreground/20 focus-visible:ring-primary/20 transition-all min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-mono tracking-wider" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  )
}
