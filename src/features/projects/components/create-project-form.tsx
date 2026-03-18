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
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-foreground/80 pl-1">Project Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Marketing Website" 
                  className="rounded-2xl border-border bg-muted/20 h-12 px-5 focus-visible:ring-primary/10 transition-all text-base font-medium" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs font-medium pl-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-foreground/80 pl-1">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the goals and scope of this project..." 
                  className="resize-none rounded-2xl border-border bg-muted/20 focus-visible:ring-primary/10 transition-all min-h-[140px] p-5 text-base font-medium" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs font-medium pl-1" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isPending} className="w-full h-12 rounded-2xl font-bold text-base shadow-premium transition-all hover:scale-[1.01] active:scale-[0.99]">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Creating Project..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
