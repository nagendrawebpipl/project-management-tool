"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Bell, 
  Settings
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Briefcase,
    href: "/projects",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-8 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center mb-12">
          <div className="h-8 w-8 bg-sidebar-primary rounded-lg mr-3 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Antigravity
          </h1>
        </Link>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-base group flex p-4 w-full justify-start font-semibold cursor-pointer rounded-2xl transition-all duration-300",
                pathname === route.href 
                  ? "bg-sidebar-accent/80 text-sidebar-primary shadow-soft" 
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/40",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-4")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
