import { mockApi } from '../mockApi'

describe('mockApi', () => {
  describe('getUsers', () => {
    it('returns 500 users', async () => {
      const users = await mockApi.getUsers()
      expect(users).toHaveLength(500)
      expect(users[0]).toHaveProperty('id')
      expect(users[0]).toHaveProperty('orgName')
      expect(users[0]).toHaveProperty('userName')
      expect(users[0]).toHaveProperty('email')
      expect(users[0]).toHaveProperty('status')
    })

    it('generates users with valid data structure', async () => {
      const users = await mockApi.getUsers()
      const user = users[0]
      
      expect(user.profile).toHaveProperty('firstName')
      expect(user.profile).toHaveProperty('lastName')
      expect(user.guarantor).toHaveProperty('firstName')
      expect(user.education).toHaveProperty('level')
      expect(user.socials).toHaveProperty('facebook')
      expect(['Active', 'Inactive', 'Pending', 'Blacklisted']).toContain(user.status)
    })
  })

  describe('getUserById', () => {
    it('returns user with matching ID', async () => {
      const user = await mockApi.getUserById('user_001')
      expect(user).toBeTruthy()
      expect(user?.id).toBe('user_001')
    })

    it('returns null for non-existent user', async () => {
      const user = await mockApi.getUserById('non_existent_id')
      expect(user).toBeNull()
    })
  })

  describe('getUserStats', () => {
    it('returns valid user statistics', async () => {
      const stats = await mockApi.getUserStats()
      
      expect(stats).toHaveProperty('totalUsers')
      expect(stats).toHaveProperty('activeUsers')
      expect(stats).toHaveProperty('usersWithLoans')
      expect(stats).toHaveProperty('usersWithSavings')
      
      expect(stats.totalUsers).toBe(500)
      expect(stats.activeUsers).toBeGreaterThan(0)
      expect(stats.usersWithLoans).toBeGreaterThan(0)
      expect(stats.usersWithSavings).toBeGreaterThan(0)
    })
  })

  describe('login', () => {
    it('returns success for valid credentials', async () => {
      const result = await mockApi.login('test@example.com', 'password123')
      
      expect(result.success).toBe(true)
      expect(result.token).toBeTruthy()
      expect(result.token).toMatch(/^mock_jwt_token_\d+$/)
    })

    it('returns failure for empty credentials', async () => {
      const result = await mockApi.login('', '')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
      expect(result.token).toBeUndefined()
    })

    it('returns failure for missing email', async () => {
      const result = await mockApi.login('', 'password123')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
    })

    it('returns failure for missing password', async () => {
      const result = await mockApi.login('test@example.com', '')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
    })
  })

  describe('delay functionality', () => {
    it('introduces appropriate delay', async () => {
      const startTime = Date.now()
      await mockApi.delay(100)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(90) // Allow for some variance
    })
  })
})