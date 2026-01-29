import { User } from '@/types/user'

const STORAGE_KEYS = {
  USERS: 'lendsqr_users',
  SELECTED_USER: 'lendsqr_selected_user',
  AUTH_TOKEN: 'lendsqr_auth_token'
}

export const storageUtils = {
  // Users storage
  saveUsers: (users: User[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving users to localStorage:', error)
    }
  },

  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Error getting users from localStorage:', error)
      return []
    }
  },

  // Selected user storage
  saveSelectedUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_USER, JSON.stringify(user))
    } catch (error) {
      console.error('Error saving selected user to localStorage:', error)
    }
  },

  getSelectedUser: (): User | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.SELECTED_USER)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Error getting selected user from localStorage:', error)
      return null
    }
  },

  // Auth token storage
  saveAuthToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } catch (error) {
      console.error('Error saving auth token to localStorage:', error)
    }
  },

  getAuthToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Error getting auth token from localStorage:', error)
      return null
    }
  },

  removeAuthToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error('Error removing auth token from localStorage:', error)
    }
  },

  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}