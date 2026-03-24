import { getAuthUser } from "@/lib/auth/get-user"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await getAuthUser()

  return (
    <div className="h-full relative font-sans">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900 text-white">
        <Sidebar />
      </div>
      <main className="md:pl-72 flex flex-col h-full bg-slate-50">
        <Header />
        <div className="flex-1 h-full overflow-hidden p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
