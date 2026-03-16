"use client"

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Users } from "lucide-react"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { MobileSidebar } from "./mobile-sidebar"
import { Menu } from "lucide-react"

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  return (
    <div className="flex items-center px-4 md:px-6 border-b h-16 bg-background/80 backdrop-blur-md sticky top-0 z-40 justify-between">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="cursor-pointer h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-100">
                <Users className="h-4 w-4 text-slate-600" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
