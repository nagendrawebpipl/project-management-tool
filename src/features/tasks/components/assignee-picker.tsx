"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AssigneePickerProps {
  members: any[]
  value?: string | null
  onChange: (value: string | null) => void
}

export function AssigneePicker({ members, value, onChange }: AssigneePickerProps) {
  return (
    <Select
      value={value || "unassigned"}
      onValueChange={(val) => onChange(val === "unassigned" ? null : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select assignee" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {members.map((member) => (
          <SelectItem key={member.user_id} value={member.user_id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.profile?.avatar_url} />
                <AvatarFallback className="text-[10px]">
                  {member.profile?.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{member.profile?.full_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
