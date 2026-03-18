"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema, type UpdateProfileValues } from "../schemas"
import { updateProfileAction } from "../actions"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileSettingsFormProps {
  user: any
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.user_metadata?.full_name || "",
      avatarUrl: user.user_metadata?.avatar_url || "",
    },
  })

  async function onSubmit(values: UpdateProfileValues) {
    setIsLoading(true)
    const result = await updateProfileAction(values)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Profile updated successfully")
    }
  }

  return (
    <Card className="rounded-3xl border-border/40 bg-card shadow-soft overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/10 p-10 bg-muted/5">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground/90">Profile Settings</CardTitle>
        <CardDescription className="text-sm font-medium leading-relaxed text-muted-foreground/60">
          Update your personal information and how others see you on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-foreground/80 pl-1">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="rounded-2xl border-border/60 h-12 focus:ring-primary/20 transition-all font-medium" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs font-bold text-destructive/80 pl-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-foreground/80 pl-1">Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" className="rounded-2xl border-border/60 h-12 focus:ring-primary/20 transition-all font-medium" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs font-medium text-muted-foreground/50 pl-1">
                    Provide a direct link to a public image for your profile picture.
                  </FormDescription>
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
