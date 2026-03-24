"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateOrganizationSchema, type UpdateOrganizationValues } from "../schemas"
import { updateOrganizationAction } from "../actions"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OrgSettingsFormProps {
  organization: any
  isAdmin: boolean
}

export function OrgSettingsForm({ organization, isAdmin }: OrgSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UpdateOrganizationValues>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name,
    },
  })

  async function onSubmit(values: UpdateOrganizationValues) {
    setIsLoading(true)
    const result = await updateOrganizationAction(organization.id, values)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Organization updated successfully")
    }
  }

  if (!isAdmin) {
    return (
      <Card className="rounded-3xl border-border/40 bg-card shadow-soft overflow-hidden">
        <CardHeader className="space-y-4 border-b border-border/10 p-10 bg-muted/5">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground/90">Organization Settings</CardTitle>
          <CardDescription className="text-sm font-medium leading-relaxed text-muted-foreground/60">
            View your organization&apos;s configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground/80 pl-1 uppercase tracking-wider">Organization Name</p>
              <p className="text-2xl font-extrabold tracking-tight pl-1">{organization.name}</p>
            </div>
            <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-sm text-amber-600/80 font-medium leading-relaxed shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="font-bold text-amber-700 uppercase tracking-widest text-[10px]">Protected View</span>
              </div>
              Only organization owners and admins have the clearance to modify these technical settings.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl border-border/40 bg-card shadow-soft overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/10 p-10 bg-muted/5">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground/90">Organization Settings</CardTitle>
        <CardDescription className="text-sm font-medium leading-relaxed text-muted-foreground/60">
          Manage your organization&apos;s public profile and operational settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-foreground/80 pl-1">Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." className="rounded-2xl border-border/60 h-12 focus:ring-primary/20 transition-all font-medium" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-bold text-destructive/80 pl-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-8 border-t border-border/10">
              <Button type="submit" disabled={isLoading} className="rounded-2xl h-12 px-10 text-sm font-bold shadow-soft transition-all active:scale-95 hover:scale-[1.02]">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
