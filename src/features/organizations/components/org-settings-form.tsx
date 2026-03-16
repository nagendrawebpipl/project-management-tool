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
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            View your organization's configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-muted-foreground">{organization.name}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-900 text-xs">
              Only organization owners and admins can modify these settings.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          Manage your organization's public profile and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
