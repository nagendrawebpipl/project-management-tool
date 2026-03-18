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
    <div className="space-y-12 pb-20 max-w-[1200px] mx-auto px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm font-semibold text-muted-foreground/60 mt-2">
            Manage your account and organization preferences
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-10">
        <div className="px-2">
          <TabsList className="bg-muted/10 p-1.5 rounded-[1.5rem] border border-border/40 h-auto gap-1">
            <TabsTrigger 
              value="profile" 
              className="rounded-2xl px-8 py-3.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all flex items-center gap-3"
            >
              <User className="h-4 w-4 stroke-[2.5px]" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="organization" 
              className="rounded-2xl px-8 py-3.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-soft data-[state=active]:text-primary transition-all flex items-center gap-3"
            >
              <SettingsIcon className="h-4 w-4 stroke-[2.5px]" />
              Organization
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="profile" className="outline-none space-y-6">
          <ProfileSettingsForm user={user} />
        </TabsContent>
        <TabsContent value="organization" className="outline-none space-y-6">
          <OrgSettingsForm organization={organization} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
