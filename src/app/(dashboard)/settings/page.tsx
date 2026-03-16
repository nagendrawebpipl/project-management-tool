import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getAuthUser } from "@/lib/auth/get-user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettingsForm } from "@/features/auth/components/profile-settings-form"
import { OrgSettingsForm } from "@/features/organizations/components/org-settings-form"
import { User, Settings as SettingsIcon } from "lucide-react"

export default async function SettingsPage() {
  const { organization, role } = await getCurrentOrganization()
  const user = await getAuthUser()

  const isAdmin = role === "owner" || role === "admin"

  return (
    <div className="space-y-10 pb-20 max-w-[1200px] mx-auto">
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
        <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Settings</h2>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
          Manage your account and organization preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-10">
        <TabsList className="bg-muted/30 p-1 rounded-none h-14 border-2 border-border/40">
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-3 px-8 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-2 data-[state=active]:border-primary transition-all font-mono text-xs font-bold uppercase tracking-widest"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="organization" 
            className="flex items-center gap-3 px-8 h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-2 data-[state=active]:border-primary transition-all font-mono text-xs font-bold uppercase tracking-widest"
          >
            <SettingsIcon className="h-4 w-4" />
            Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 outline-none">
          <ProfileSettingsForm user={user} />
        </TabsContent>
        <TabsContent value="organization" className="space-y-4 outline-none">
          <OrgSettingsForm organization={organization} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
