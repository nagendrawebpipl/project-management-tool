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
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            {canManage && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-slate-100 text-xs text-slate-600">
                    {member.profile?.full_name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{member.profile?.full_name}</span>
                  <span className="text-xs text-muted-foreground">{member.profile?.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(member.joined_at), "MMM d, yyyy")}
              </TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0 focus:outline-none")}
                      disabled={isUpdating === member.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "manager")}>
                        Make Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member")}>
                        Make Member
                      </DropdownMenuItem>
                      <ConfirmDialog
                        trigger={
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 text-red-600">
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
