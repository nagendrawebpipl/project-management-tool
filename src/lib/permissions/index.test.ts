import { describe, it, expect } from 'vitest'
import { 
  hasMinRole, 
  canCreateProject, 
  canArchiveProject, 
  canDeleteProject,
  canCreateTask,
  canDeleteTask 
} from './index'
import { UserRole } from '@/types'

describe('Permission Helpers', () => {
  describe('hasMinRole', () => {
    it('returns true if user has higher or equal role', () => {
      expect(hasMinRole('owner', 'member')).toBe(true)
      expect(hasMinRole('admin', 'admin')).toBe(true)
      expect(hasMinRole('member', 'member')).toBe(true)
    })

    it('returns false if user has lower role', () => {
      expect(hasMinRole('member', 'admin')).toBe(false)
      expect(hasMinRole('manager', 'owner')).toBe(false)
    })
  })

  describe('Project Permissions', () => {
    it('allows manager and above to create projects', () => {
      expect(canCreateProject('manager')).toBe(true)
      expect(canCreateProject('admin')).toBe(true)
      expect(canCreateProject('owner')).toBe(true)
      expect(canCreateProject('member')).toBe(false)
    })

    it('allows only admin and above to archive projects', () => {
      expect(canArchiveProject('admin')).toBe(true)
      expect(canArchiveProject('owner')).toBe(true)
      expect(canArchiveProject('manager')).toBe(false)
    })

    it('allows only owner to delete projects', () => {
      expect(canDeleteProject('owner')).toBe(true)
      expect(canDeleteProject('admin')).toBe(false)
    })
  })

  describe('Task Permissions', () => {
    it('allows all roles to create tasks', () => {
      expect(canCreateTask('member')).toBe(true)
      expect(canCreateTask('manager')).toBe(true)
    })

    it('allows manager and above to delete tasks', () => {
      expect(canDeleteTask('manager')).toBe(true)
      expect(canDeleteTask('member')).toBe(false)
    })
  })
})
