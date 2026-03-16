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
      <Card className="rounded-none border-2 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="space-y-4 border-b border-border/40 p-10 bg-muted/20">
          <CardTitle className="text-2xl font-extrabold tracking-tighter uppercase font-mono">Organization Settings</CardTitle>
          <CardDescription className="text-sm font-medium leading-relaxed">
            View your organization's configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">Organization Name</p>
              <p className="text-xl font-extrabold font-mono uppercase">{organization.name}</p>
            </div>
            <div className="p-6 bg-amber-500/10 border-2 border-amber-500/30 text-[11px] text-amber-600 font-bold uppercase tracking-[0.2em] font-mono leading-loose">
              <span className="text-amber-700 block mb-1">PROTECTED VIEW</span>
              Only organization owners and admins have the clearance to modify these technical settings.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-none border-2 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/40 p-10 bg-muted/20">
        <CardTitle className="text-2xl font-extrabold tracking-tighter uppercase font-mono">Organization Settings</CardTitle>
        <CardDescription className="text-sm font-medium leading-relaxed">
          Manage your organization's public profile and operational settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." className="rounded-none border-2 h-11 focus:ring-0 focus:border-primary transition-all font-mono" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold font-mono" />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-6 border-t border-border/40">
              <Button type="submit" disabled={isLoading} className="rounded-none h-12 px-12 text-xs font-bold uppercase tracking-[0.2em] font-mono border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
