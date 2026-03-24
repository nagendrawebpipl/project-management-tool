import { getCurrentOrganization } from "@/lib/auth/get-organization"
export const dynamic = "force-dynamic"
import { getAuthUser } from "@/lib/auth/get-user"
import { 
  getDashboardStats,
  getOverdueTasks
} from "@/features/dashboard/queries"
import { getRecentActivity } from "@/features/activity/queries"
import { StatsCard } from "@/features/dashboard/components/stats-card"
import { TasksByStatusWidget } from "@/features/dashboard/components/tasks-by-status-widget"
import { TasksByPriorityWidget } from "@/features/dashboard/components/tasks-by-priority-widget"
import { RecentActivityWidget } from "@/features/dashboard/components/recent-activity-widget"
import { OverdueTasksWidget } from "@/features/dashboard/components/overdue-tasks-widget"
import { Briefcase, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  let _currentStep = "Initializing";
  try {
    _currentStep = "Fetching Organization";
    const { organization } = await getCurrentOrganization()
    
    _currentStep = "Fetching User";
    const _user = await getAuthUser()

    // Separate fetchers with safety catch for other widgets
    const safeFetch = async <T,>(promise: Promise<T>, fallback: T, name: string): Promise<T> => {
      try {
        return await promise;
      } catch (e: any) {
        console.error(`Dashboard fetch error [${name}]:`, e);
        return fallback;
      }
    };

    _currentStep = "Loading Dashboard Stats";
    const stats = await safeFetch(getDashboardStats(organization.id), {
      projectCount: 0,
      totalTasks: 0,
      completedTasks: 0,
      urgentTasks: 0,
      completionRate: 0,
      statusCounts: { todo: 0, in_progress: 0, review: 0, done: 0 },
      priorityCounts: { low: 0, medium: 0, high: 0, urgent: 0 }
    }, "DashboardStats");

    _currentStep = "Loading Overdue Tasks";
    const overdueTasks = await safeFetch(getOverdueTasks(organization.id), [], "OverdueTasks");
    
    _currentStep = "Loading Recent Activity";
    const activities = await safeFetch(getRecentActivity(organization.id, 10), [], "RecentActivity");

    _currentStep = "Rendering UI";
    return (
      <div className="space-y-8 pb-10 max-w-7xl mx-auto">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            Here&apos;s an overview of what&apos;s happening across your team.
          </p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Active Projects"
            value={stats.projectCount}
            icon={Briefcase}
            iconBgClass="bg-blue-500/10"
            iconColorClass="text-blue-600"
            description={`of ${stats.projectCount} total`}
          />
          <StatsCard 
            title="Open Tasks"
            value={stats.totalTasks - stats.completedTasks}
            icon={Clock}
            iconBgClass="bg-orange-500/10"
            iconColorClass="text-orange-600"
            description={`${stats.completedTasks} completed`}
          />
          <StatsCard 
            title="Urgent Tasks"
            value={stats.urgentTasks}
            icon={AlertCircle}
            iconBgClass="bg-red-500/10"
            iconColorClass="text-red-600"
            description="Requires attention"
          />
          <StatsCard 
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={CheckCircle2}
            iconBgClass="bg-emerald-500/10"
            iconColorClass="text-emerald-600"
            description="Overall progress"
          />
        </div>

        {/* Breakdown Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <TasksByStatusWidget counts={stats.statusCounts} />
          <TasksByPriorityWidget counts={stats.priorityCounts} />
        </div>

        {/* Activity & Deadlines Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivityWidget activities={activities} />
          </div>
          <div className="lg:col-span-1">
            <OverdueTasksWidget tasks={overdueTasks} />
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4 py-20">
        <Card className="max-w-xl w-full rounded-3xl border-destructive/20 bg-destructive/5 p-10 shadow-soft text-center group transition-all hover:bg-destructive/10">
          <div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            Dashboard Analytics Unavailable
          </h2>
          <p className="text-muted-foreground font-medium mb-8">
            We encountered an unexpected error while preparing your workspace overview.
          </p>
          <div className="text-left">
            <pre className="p-6 bg-slate-950 text-emerald-400 rounded-2xl border border-emerald-400/20 overflow-auto max-h-[300px] text-[11px] font-mono leading-relaxed">
              {error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred"}
            </pre>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-8 rounded-2xl h-12 px-10 font-bold shadow-soft transition-all hover:scale-105"
              )}
            >
              Try Again
            </Link>
          </div>
        </Card>
      </div>
    );
  }
}
