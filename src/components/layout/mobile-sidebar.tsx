"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

export function MobileSidebar() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 hover:bg-slate-100 rounded-md">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-slate-900 border-none text-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
