"use client"

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { updateMemberRoleAction, removeMemberAction } from "../actions"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useState } from "react"
import { UserRole } from "@/types"

interface TeamMemberListProps {
  members: any[]
  orgId: string
  currentUserRole: string
}

export function TeamMemberList({ members, orgId, currentUserRole }: TeamMemberListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const canManage = currentUserRole === "owner" || currentUserRole === "admin"

  const handleUpdateRole = async (memberId: string, role: UserRole) => {
    setIsUpdating(memberId)
    const result = await updateMemberRoleAction(orgId, { memberId, role })
    setIsUpdating(null)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Role updated")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const result = await removeMemberAction(orgId, memberId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Member removed")
    }
  }

  return (
    <div className="rounded-none border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold h-12">Member</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold h-12">Role</TableHead>
            <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold h-12">Joined</TableHead>
            {canManage && <TableHead className="w-[100px] font-mono text-[10px] uppercase tracking-[0.2em] font-bold h-12">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-border/40 hover:bg-muted/20 transition-colors">
              <TableCell className="py-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-border/40">
                    <AvatarImage src={member.profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-slate-100 text-[10px] font-bold font-mono text-slate-600">
                      {member.profile?.full_name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold tracking-tight">{member.profile?.full_name}</span>
                    <span className="text-xs text-muted-foreground/70 font-mono tracking-tight">{member.profile?.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-6">
                <Badge variant="outline" className="capitalize font-mono text-xs border-2 px-2 py-0.5 rounded-none font-bold tracking-tight">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell className="text-sm font-bold font-mono text-muted-foreground/80 py-6 tracking-tight">
                {format(new Date(member.joined_at), "MMM d, yyyy").toUpperCase()}
              </TableCell>
              {canManage && (
                <TableCell className="py-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className={cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 focus:outline-none hover:bg-muted/40 border border-transparent hover:border-border/40 transition-all")}
                      disabled={isUpdating === member.id}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="font-mono uppercase text-[10px] tracking-widest font-bold">
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")} className="cursor-pointer">
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "manager")} className="cursor-pointer">
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member")} className="cursor-pointer">
                        Make Member
                      </DropdownMenuItem>
                      <ConfirmDialog
                        trigger={
                          <div className="relative flex cursor-default select-none items-center px-2 py-1.5 outline-none transition-colors hover:bg-destructive/10 text-destructive">
                            Remove from Team
                          </div>
                        }
                        title="Remove Member"
                        description="Are you sure you want to remove this member? They will lose all access to this organization."
                        onConfirm={() => handleRemoveMember(member.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
