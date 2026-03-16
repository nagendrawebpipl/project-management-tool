export type UserRole = "owner" | "admin" | "manager" | "member"
export type MemberStatus = "active" | "invited" | "deactivated"
export type ProjectStatus = "active" | "completed" | "archived"
export type TaskStatus = "todo" | "in_progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high" | "critical"

export interface UserContext {
  user: any // Replace with proper type when DB types are generated
  organizationId: string
  role: UserRole
}
