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
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2 font-mono border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
        <UserPlus className="mr-3 h-5 w-5" />
        Add Member
      </DialogTrigger>
      <DialogContent className="rounded-none border-2">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-extrabold tracking-tighter uppercase font-mono">Add Team Member</DialogTitle>
          <DialogDescription className="text-sm font-medium leading-relaxed">
            Enter the email address of the person you'd like to add to your team.
          </DialogDescription>
          <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-600 font-bold uppercase tracking-widest font-mono">
            Note: For MVP, users must already have an account.
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" className="rounded-none border-2 focus:ring-0 focus:border-primary transition-all font-mono" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold font-mono" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground font-mono">Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-2 h-11 focus:ring-0 transition-all font-mono uppercase text-xs font-bold tracking-widest">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-2 font-mono uppercase text-[10px] font-bold tracking-widest">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] uppercase font-bold font-mono" />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoading} className="rounded-none h-12 px-10 text-xs font-bold uppercase tracking-[0.2em] font-mono border-2 border-primary">
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
