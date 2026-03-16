import { UserRole } from "@/types"

/**
 * Role hierarchy levels
 */
export const ROLE_LEVELS: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  manager: 2,
  member: 1,
}

/**
 * Checks if a user has at least the minimum role required.
 */
export function hasMinRole(userRole: UserRole, minRole: UserRole) {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[minRole]
}

/**
 * Permission helpers for the organization and its projects.
 * These are used by both server actions and UI components.
 */

export function canCreateProject(role: UserRole) {
  return hasMinRole(role, "manager")
}

export function canEditProject(role: UserRole) {
  return hasMinRole(role, "manager")
}

export function canArchiveProject(role: UserRole) {
  return hasMinRole(role, "admin")
}

export function canDeleteProject(role: UserRole) {
  return hasMinRole(role, "owner")
}

export function canManageMembers(role: UserRole) {
  return hasMinRole(role, "admin")
}

// Task Permissions
export function canCreateTask(role: UserRole) {
  return hasMinRole(role, "member")
}

export function canEditTask(role: UserRole) {
  return hasMinRole(role, "member")
}

export function canDeleteTask(role: UserRole) {
  return hasMinRole(role, "manager")
}

export function canMoveTask(role: UserRole) {
  return hasMinRole(role, "member")
}

export function canCommentOnTask(role: UserRole) {
  return hasMinRole(role, "member")
}

export function canUploadAttachment(role: UserRole) {
  return hasMinRole(role, "member")
}
