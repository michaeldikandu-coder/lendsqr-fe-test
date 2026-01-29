import { User, UserStats } from '@/types/user'

// Generate mock user data
const generateMockUsers = (count: number): User[] => {
  const users: User[] = []
  const statuses: User['status'][] = ['Active', 'Inactive', 'Pending', 'Blacklisted']
  const organizations = ['Lendsqr', 'Irorun', 'Lendstar', 'Paystack', 'Flutterwave']
  const sectors = ['FinTech', 'Banking', 'Technology', 'Healthcare', 'Education']
  
  for (let i = 1; i <= count; i++) {
    const firstName = `User${i}`
    const lastName = `Test${i}`
    const user: User = {
      id: `user_${i.toString().padStart(3, '0')}`,
      orgName: organizations[Math.floor(Math.random() * organizations.length)],
      userName: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`,
      email: `user${i}@example.com`,
      phoneNumber: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      dateJoined: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      profile: {
        firstName,
        lastName,
        phoneNumber: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        bvn: Math.floor(Math.random() * 90000000000) + 10000000000,
        address: `${Math.floor(Math.random() * 999) + 1} Random Street, Lagos, Nigeria`,
        currency: 'NGN'
      },
      guarantor: {
        firstName: `Guarantor${i}`,
        lastName: `Test${i}`,
        phoneNumber: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        address: `${Math.floor(Math.random() * 999) + 1} Guarantor Street, Abuja, Nigeria`
      },
      accountBalance: (Math.random() * 1000000).toFixed(2),
      accountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
      socials: {
        facebook: `facebook.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        instagram: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        twitter: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`
      },
      education: {
        level: ['B.Sc', 'M.Sc', 'Ph.D', 'HND', 'OND'][Math.floor(Math.random() * 5)],
        employmentStatus: ['Employed', 'Unemployed', 'Self-employed'][Math.floor(Math.random() * 3)],
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        duration: `${Math.floor(Math.random() * 10) + 1} years`,
        officeEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        monthlyIncome: [`₦${(Math.random() * 500000 + 50000).toFixed(0)}`, `₦${(Math.random() * 500000 + 50000).toFixed(0)}`],
        loanRepayment: `₦${(Math.random() * 50000 + 5000).toFixed(0)}`
      }
    }
    users.push(user)
  }
  
  return users
}

export const mockApi = {
  // Simulate API delay
  delay: (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all users
  getUsers: async (): Promise<User[]> => {
    await mockApi.delay(800)
    return generateMockUsers(500)
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    await mockApi.delay(500)
    const users = generateMockUsers(500)
    return users.find(user => user.id === id) || null
  },

  // Get user statistics
  getUserStats: async (): Promise<UserStats> => {
    await mockApi.delay(600)
    const users = generateMockUsers(500)
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'Active').length,
      usersWithLoans: Math.floor(users.length * 0.6), // 60% have loans
      usersWithSavings: Math.floor(users.length * 0.8) // 80% have savings
    }
  },

  // Login simulation
  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
    await mockApi.delay(1000)
    
    // Simple validation - any email/password combination works for demo
    if (email && password) {
      return {
        success: true,
        token: 'mock_jwt_token_' + Date.now()
      }
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    }
  }
}