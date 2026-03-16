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
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and organization preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 pt-4">
          <ProfileSettingsForm user={user} />
        </TabsContent>
        <TabsContent value="organization" className="space-y-4 pt-4">
          <OrgSettingsForm organization={organization} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
