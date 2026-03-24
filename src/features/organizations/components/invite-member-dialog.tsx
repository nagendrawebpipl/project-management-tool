"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inviteMemberSchema, type InviteMemberValues } from "../schemas"
import { inviteMemberAction } from "../actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus } from "lucide-react"

interface InviteMemberDialogProps {
  orgId: string
}

export function InviteMemberDialog({ orgId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  })

  async function onSubmit(values: InviteMemberValues) {
    setIsLoading(true)
    const result = await inviteMemberAction(orgId, values)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Member added successfully")
      setOpen(false)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="default" className="h-11 px-6 rounded-2xl font-bold shadow-soft transition-all active:scale-95 flex items-center gap-3">
            <UserPlus className="h-4 w-4 stroke-[2.5px]" />
            Add Member
          </Button>
        }
      />
      <DialogContent className="rounded-[2rem] border-border/20 shadow-premium sm:max-w-[480px] p-0 overflow-hidden">
        <div className="p-10 border-b border-border/10">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-bold tracking-tight text-foreground/90">Add Team Member</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/60 leading-relaxed">
              Enter the email address of the person you&apos;d like to add to your team.
            </DialogDescription>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] text-primary/80 font-bold uppercase tracking-widest flex items-center gap-3">
              <div className="size-2 bg-primary rounded-full animate-pulse" />
              Note: Users must already have an account for this MVP.
            </div>
          </DialogHeader>
        </div>
        <div className="p-10 bg-muted/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel className="text-sm font-bold text-foreground/80 pl-1">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" className="h-14 rounded-2xl border-border/60 bg-background px-5 focus-visible:ring-primary/20 transition-all text-base font-medium shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold text-destructive/80 pl-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2.5 relative pb-8">
                    <FormLabel className="text-sm font-bold text-foreground/80 pl-1">Assign Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-2xl border-border/60 bg-background h-14 px-5 focus:ring-primary/20 transition-all text-base font-bold text-foreground/80 shadow-sm">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent 
                        alignItemWithTrigger={false} 
                        side="bottom" 
                        sideOffset={12}
                        className="rounded-2xl border border-border/40 !bg-background p-1.5 shadow-premium font-bold text-base !z-[999] !opacity-100 min-w-[200px]"
                      >
                        <SelectItem value="admin" className="rounded-xl py-3 px-4 focus:bg-primary/10 hover:bg-primary/10 transition-colors cursor-pointer text-sm font-bold">Admin</SelectItem>
                        <SelectItem value="manager" className="rounded-xl py-3 px-4 focus:bg-primary/10 hover:bg-primary/10 transition-colors cursor-pointer text-sm font-bold">Manager</SelectItem>
                        <SelectItem value="member" className="rounded-xl py-3 px-4 focus:bg-primary/10 hover:bg-primary/10 transition-colors cursor-pointer text-sm font-bold">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold text-destructive/80 pl-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-bold text-base shadow-premium transition-all hover:scale-[1.01] active:scale-[0.98] bg-primary text-primary-foreground">
                  {isLoading ? "Enrolling Member..." : "Enroll Team Member"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
