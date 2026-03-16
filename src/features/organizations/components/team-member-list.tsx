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
    <div className="rounded-none border-2 border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm font-mono">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-b-2 border-border/40 hover:bg-transparent">
            <TableHead className="text-[10px] font-bold uppercase tracking-widest h-12">Member_Identifier</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest h-12">Clearance_Role</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest h-12">Registry_Date</TableHead>
            {canManage && <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-widest h-12">Operations</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors group">
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-border/40 rounded-none">
                    <AvatarImage src={member.profile?.avatar_url || ""} className="grayscale group-hover:grayscale-0 transition-all" />
                    <AvatarFallback className="bg-muted text-[10px] font-bold font-mono rounded-none">
                      {member.profile?.full_name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold uppercase tracking-tight leading-none mb-1">{member.profile?.full_name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/60">{member.profile?.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex items-center px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-widest rounded-none",
                  member.role === 'owner' ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border/40 text-muted-foreground"
                )}>
                  {member.role}
                </div>
              </TableCell>
              <TableCell className="text-[11px] font-bold text-muted-foreground/80">
                {format(new Date(member.joined_at), "yyyy-MM-dd HH:mm")}
              </TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className={cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 rounded-none border border-transparent hover:border-border/40 hover:bg-muted/50 focus:outline-none transition-all")}
                      disabled={isUpdating === member.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-2 border-border/40 shadow-xl font-mono">
                      <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary focus:text-primary-foreground" onClick={() => handleUpdateRole(member.id, "admin")}>
                        PROMOT_TO_ADMIN
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary focus:text-primary-foreground" onClick={() => handleUpdateRole(member.id, "manager")}>
                        SET_AS_MANAGER
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary focus:text-primary-foreground" onClick={() => handleUpdateRole(member.id, "member")}>
                        ASSIGN_MEMBER_ROLE
                      </DropdownMenuItem>
                      <div className="h-px bg-border/40 my-1" />
                      <ConfirmDialog
                        trigger={
                          <div className="relative flex cursor-pointer select-none items-center px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest outline-none transition-colors hover:bg-destructive hover:text-destructive-foreground text-destructive">
                            TERMINATE_MEMBERSHIP
                          </div>
                        }
                        title="Confirm Termination"
                        description="ARE YOU SURE YOU WANT TO REVOKE ACCESS FOR THIS OPERATIVE? THIS ACTION IS PERMANENT."
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
