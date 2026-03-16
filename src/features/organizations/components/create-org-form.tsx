"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { organizationSchema, type OrganizationValues } from "../schemas"
import { createOrganizationAction } from "../actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"

export function CreateOrganizationForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  // Auto-generate slug from name
  const name = form.watch("name")
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      form.setValue("slug", slug, { shouldValidate: true })
    }
  }, [name, form])

  function onSubmit(values: OrganizationValues) {
    setError(null)
    startTransition(async () => {
      const result = await createOrganizationAction(values)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                This is the name of your team or company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input placeholder="acme-corp" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                The URL for your organization (e.g., app.com/org-slug).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating organization..." : "Create organization"}
        </Button>
      </form>
    </Form>
  )
}
