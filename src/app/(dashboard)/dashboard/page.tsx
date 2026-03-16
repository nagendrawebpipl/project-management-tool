import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { getAuthUser } from "@/lib/auth/get-user"
import { 
  getMyTasks, 
  getOverdueTasks, 
  getTaskCountsByStatus, 
  getProjectSummary
} from "@/features/dashboard/queries"
import { getRecentActivity } from "@/features/activity/queries"
import { MyTasksWidget } from "@/features/dashboard/components/my-tasks-widget"
import { OverdueTasksWidget } from "@/features/dashboard/components/overdue-tasks-widget"
import { TasksByStatusWidget } from "@/features/dashboard/components/tasks-by-status-widget"
import { ProjectSummaryWidget } from "@/features/dashboard/components/project-summary-widget"
import { RecentActivityWidget } from "@/features/dashboard/components/recent-activity-widget"

export default async function DashboardPage() {
  let currentStep = "Initializing";
  try {
    currentStep = "Fetching Organization";
    const { organization } = await getCurrentOrganization()
    
    currentStep = "Fetching User";
    const user = await getAuthUser()

    // Separate fetchers with safety catch for other widgets
    const safeFetch = async <T,>(promise: Promise<T>, fallback: T, name: string): Promise<T> => {
      try {
        return await promise;
      } catch (e: any) {
        console.error(`Dashboard fetch error [${name}]:`, e);
        return fallback;
      }
    };

    currentStep = "Loading My Tasks";
    const myTasks = await safeFetch(getMyTasks(user.id, organization.id), [], "MyTasks");
    
    currentStep = "Loading Overdue Tasks";
    const overdueTasks = await safeFetch(getOverdueTasks(organization.id), [], "OverdueTasks");
    
    currentStep = "Loading Status Counts";
    const statusCounts = await safeFetch(getTaskCountsByStatus(organization.id), { todo: 0, in_progress: 0, review: 0, done: 0 }, "StatusCounts");
    
    currentStep = "Loading Project Summary";
    const projects = await safeFetch(getProjectSummary(organization.id), [], "ProjectSummary");
    
    currentStep = "Loading Recent Activity";
    const activities = await safeFetch(getRecentActivity(organization.id, 10), [], "RecentActivity");

    currentStep = "Rendering UI";
    return (
      <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 w-1.5 h-full bg-primary/20 rounded-full" />
          <h2 className="text-4xl font-extrabold tracking-tighter font-mono uppercase">Dashboard</h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/70 font-mono mt-3">
            System Overview for <span className="text-primary">{organization.name}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-2">
            <TasksByStatusWidget counts={statusCounts} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <OverdueTasksWidget tasks={overdueTasks} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="md:col-span-4 lg:col-span-4">
            <MyTasksWidget tasks={myTasks} />
          </div>
          <div className="md:col-span-3 lg:col-span-3">
            <ProjectSummaryWidget projects={projects} />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1">
          <RecentActivityWidget activities={activities} />
        </div>
      </div>
    );
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    return (
      <div className="p-10 border-4 border-destructive bg-destructive/5 rounded-none max-w-3xl mx-auto my-20 font-mono">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 bg-destructive text-destructive-foreground p-2 inline-block">
          System Breach: Dashboard Failure
        </h2>
        <div className="space-y-6">
          <div className="p-4 bg-slate-950 text-emerald-400 border border-emerald-400/30">
            <p className="mb-2 text-xs opacity-70 uppercase tracking-widest">Failed at Stage:</p>
            <p className="text-lg font-bold">[{currentStep}]</p>
          </div>
          
          <div className="p-4 bg-slate-900 text-slate-100 border border-slate-700">
             <p className="mb-2 text-xs opacity-50 uppercase tracking-widest">Payload Data:</p>
             <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[400px]">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>

          <div className="text-sm text-destructive font-bold p-4 bg-white border-2 border-destructive">
            ERROR: {error.message || "RAW_OBJECT_DETECTED"}
          </div>
        </div>
      </div>
    );
  }
}
