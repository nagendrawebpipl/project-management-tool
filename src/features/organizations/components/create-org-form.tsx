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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="ACME INDUSTRIAL" className="rounded-none border-2 h-11 focus:ring-0 focus:border-primary transition-all font-mono uppercase" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription className="text-[10px] font-medium italic text-muted-foreground/60 font-mono">
                The primary designation of your operational unit.
              </FormDescription>
              <FormMessage className="text-[10px] uppercase font-bold font-mono" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">System Slug</FormLabel>
              <FormControl>
                <Input placeholder="acme-industrial" className="rounded-none border-2 h-11 focus:ring-0 focus:border-primary transition-all font-mono text-primary/70" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription className="text-[10px] font-medium italic text-muted-foreground/60 font-mono">
                The identifier used for technical indexing and URL routing.
              </FormDescription>
              <FormMessage className="text-[10px] uppercase font-bold font-mono" />
            </FormItem>
          )}
        />
        {error && <p className="text-[11px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 p-3 border border-destructive/20 font-mono">{error}</p>}
        <div className="pt-6 border-t border-border/40">
          <Button type="submit" className="w-full rounded-none h-12 text-xs font-bold uppercase tracking-[0.2em] font-mono border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" disabled={isPending}>
            {isPending ? "INITIALIZING..." : "CREATE WORKSPACE_"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
