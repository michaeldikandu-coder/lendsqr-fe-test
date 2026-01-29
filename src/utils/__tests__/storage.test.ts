import { storageUtils } from '../storage'
import { User } from '@/types/user'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const mockUser: User = {
  id: 'user_001',
  orgName: 'Lendsqr',
  userName: 'testuser1',
  email: 'test1@example.com',
  phoneNumber: '+2341234567890',
  dateJoined: '2023-01-15T10:30:00Z',
  status: 'Active',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+2341234567890',
    avatar: 'https://example.com/avatar.jpg',
    gender: 'Male',
    bvn: '12345678901',
    address: '123 Test Street, Lagos, Nigeria',
    currency: 'NGN'
  },
  guarantor: {
    firstName: 'Guarantor',
    lastName: 'Test',
    phoneNumber: '+2341234567891',
    gender: 'Female',
    address: '456 Guarantor Street, Abuja, Nigeria'
  },
  accountBalance: '50000.00',
  accountNumber: '1234567890',
  socials: {
    facebook: 'facebook.com/testuser',
    instagram: '@testuser',
    twitter: '@testuser'
  },
  education: {
    level: 'B.Sc',
    employmentStatus: 'Employed',
    sector: 'FinTech',
    duration: '2 years',
    officeEmail: 'test@company.com',
    monthlyIncome: ['₦100000', '₦150000'],
    loanRepayment: '₦25000'
  }
}

describe('storageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('saveUsers and getUsers', () => {
    it('saves and retrieves users correctly', () => {
      const users = [mockUser]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(users))
      
      storageUtils.saveUsers(users)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('lendsqr_users', JSON.stringify(users))
      
      const retrievedUsers = storageUtils.getUsers()
      expect(retrievedUsers).toEqual(users)
    })

    it('returns empty array when no users stored', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const users = storageUtils.getUsers()
      expect(users).toEqual([])
    })

    it('handles JSON parse error gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const users = storageUtils.getUsers()
      expect(users).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('saveSelectedUser and getSelectedUser', () => {
    it('saves and retrieves selected user correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      storageUtils.saveSelectedUser(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('lendsqr_selected_user', JSON.stringify(mockUser))
      
      const retrievedUser = storageUtils.getSelectedUser()
      expect(retrievedUser).toEqual(mockUser)
    })

    it('returns null when no user selected', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const user = storageUtils.getSelectedUser()
      expect(user).toBeNull()
    })
  })

  describe('auth token methods', () => {
    it('saves and retrieves auth token correctly', () => {
      const token = 'mock_token_123'
      localStorageMock.getItem.mockReturnValue(token)
      
      storageUtils.saveAuthToken(token)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('lendsqr_auth_token', token)
      
      const retrievedToken = storageUtils.getAuthToken()
      expect(retrievedToken).toBe(token)
    })

    it('removes auth token correctly', () => {
      storageUtils.removeAuthToken()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lendsqr_auth_token')
    })

    it('returns null when no token stored', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const token = storageUtils.getAuthToken()
      expect(token).toBeNull()
    })
  })

  describe('clearAll', () => {
    it('clears all stored data', () => {
      storageUtils.clearAll()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lendsqr_users')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lendsqr_selected_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lendsqr_auth_token')
    })
  })

  describe('error handling', () => {
    it('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      storageUtils.saveUsers([mockUser])
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })
})