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
    <Card className="rounded-none border-2 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/40 p-10 bg-muted/20">
        <CardTitle className="text-2xl font-extrabold tracking-tighter uppercase font-mono">Profile Settings</CardTitle>
        <CardDescription className="text-sm font-medium leading-relaxed">
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
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="rounded-none border-2 h-11 focus:ring-0 focus:border-primary transition-all font-mono" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold font-mono" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" className="rounded-none border-2 h-11 focus:ring-0 focus:border-primary transition-all font-mono" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs font-medium italic text-muted-foreground/60">
                    Provide a direct link to a public image for your profile picture.
                  </FormDescription>
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
