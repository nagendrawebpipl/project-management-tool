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
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { updateMemberRoleAction, removeMemberAction } from "../actions"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { canManageMembers } from "@/lib/permissions"
import { useState } from "react"
import { UserRole } from "@/types"

interface TeamMemberListProps {
  members: any[]
  orgId: string
  currentUserRole: string
}

export function TeamMemberList({ members, orgId, currentUserRole }: TeamMemberListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const canManage = canManageMembers(currentUserRole as UserRole)

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
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/10 border-b border-border/10">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 h-14 pl-8">Member</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 h-14">Role</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 h-14">Joined</TableHead>
            {canManage && <TableHead className="w-[100px] text-xs font-bold uppercase tracking-widest text-muted-foreground/50 h-14 pr-8">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-border/10 hover:bg-muted/5 transition-colors group">
              <TableCell className="py-6 pl-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11 border border-border/20 shadow-soft transition-transform group-hover:scale-105">
                    <AvatarImage src={member.profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/5 text-[11px] font-bold text-primary/70">
                      {member.profile?.full_name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-foreground/90">{member.profile?.full_name}</span>
                    <span className="text-xs font-medium text-muted-foreground/50">{member.profile?.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-6">
                <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none shadow-soft">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell className="text-sm font-bold text-muted-foreground/40 py-6">
                {format(new Date(member.joined_at), "MMM d, yyyy")}
              </TableCell>
              {canManage && (
                <TableCell className="py-6 pr-8 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className="h-10 w-10 inline-flex items-center justify-center rounded-2xl hover:bg-muted/40 transition-all active:scale-95 border border-transparent hover:border-border/20 disabled:opacity-50 cursor-pointer"
                          disabled={isUpdating === member.id}
                        />
                      }
                    >
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground/60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-border/40 shadow-premium p-1.5 min-w-[160px]">
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin" as UserRole)} className="rounded-xl px-3 py-2 text-xs font-bold text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "manager" as UserRole)} className="rounded-xl px-3 py-2 text-xs font-bold text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member" as UserRole)} className="rounded-xl px-3 py-2 text-xs font-bold text-foreground/70 hover:text-primary transition-colors cursor-pointer">
                        Make Member
                      </DropdownMenuItem>
                      <div className="h-px bg-border/40 my-1 mx-1.5" />
                      <ConfirmDialog
                        trigger={
                          <div className="w-full rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left">
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