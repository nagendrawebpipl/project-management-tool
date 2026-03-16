import { CreateOrganizationForm } from "@/features/organizations/components/create-org-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthUser } from "@/lib/auth/get-user"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const user = await getAuthUser()
  const supabase = await createClient()

  // Check if user already has an organization
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .single()

  if (membership) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card className="border-none shadow-premium">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Setup your workspace
            </CardTitle>
            <CardDescription className="text-center">
              Create an organization to start managing your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrganizationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
