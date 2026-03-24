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


export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  return (
    <div className="flex items-center px-6 md:px-10 border-b h-20 bg-background/80 backdrop-blur-md sticky top-0 z-40 justify-between shadow-sm">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-x-6">
        <ThemeToggle />
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="cursor-pointer h-10 w-10 border-2 border-background shadow-sm hover:scale-105 transition-transform">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
            <DropdownMenuItem onClick={() => router.push("/settings")} className="rounded-lg p-2.5 font-medium">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="rounded-lg p-2.5 font-medium text-destructive focus:text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
