import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from './schemas'

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Invalid email address')
      }
    })

    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('accepts valid signup data', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('rejects short fullName', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'J',
      })
      expect(result.success).toBe(false)
    })
  })
})
