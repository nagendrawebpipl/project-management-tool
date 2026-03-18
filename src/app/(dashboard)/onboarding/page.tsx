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
    .maybeSingle()

  if (membership) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[500px] relative z-10 p-4">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
          <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Setup Workspace</h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
            Initialize your project management core
          </p>
        </div>

        <Card className="rounded-none border-2 border-border/40 bg-card/60 backdrop-blur-sm shadow-2xl overflow-hidden">
          <CardHeader className="space-y-4 border-b border-border/40 p-10 bg-muted/20">
            <CardTitle className="text-xl font-extrabold tracking-tighter uppercase font-mono">Create Organization</CardTitle>
            <CardDescription className="text-sm font-medium leading-relaxed">
              Define your organization to start managing systems, projects, and personnel.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <CreateOrganizationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
