import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import UserTable from '../UserTable'
import { User } from '@/types/user'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock storage utils
jest.mock('@/utils/storage', () => ({
  storageUtils: {
    saveSelectedUser: jest.fn(),
  },
}))

const mockPush = jest.fn()
const mockUsers: User[] = [
  {
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
]

describe('UserTable', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders user table with data', () => {
    render(<UserTable users={mockUsers} isLoading={false} />)
    
    expect(screen.getByText('Lendsqr')).toBeInTheDocument()
    expect(screen.getByText('testuser1')).toBeInTheDocument()
    expect(screen.getByText('test1@example.com')).toBeInTheDocument()
    expect(screen.getByText('+2341234567890')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<UserTable users={[]} isLoading={true} />)
    
    expect(screen.getByText('Loading users...')).toBeInTheDocument()
  })

  it('navigates to user details when row is clicked', async () => {
    render(<UserTable users={mockUsers} isLoading={false} />)
    
    const userRow = screen.getByText('testuser1').closest('tr')
    fireEvent.click(userRow!)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/users/user_001')
    })
  })

  it('opens filter modal when filter button is clicked', () => {
    render(<UserTable users={mockUsers} isLoading={false} />)
    
    const filterButtons = screen.getAllByAltText('Filter')
    fireEvent.click(filterButtons[0])
    
    expect(screen.getByText('Organization')).toBeInTheDocument()
  })

  it('filters users correctly', async () => {
    render(<UserTable users={mockUsers} isLoading={false} />)
    
    // Open filter modal
    const filterButtons = screen.getAllByAltText('Filter')
    fireEvent.click(filterButtons[0])
    
    // Set organization filter
    const orgSelect = screen.getByDisplayValue('Select')
    fireEvent.change(orgSelect, { target: { value: 'Lendsqr' } })
    
    // Apply filter
    const filterButton = screen.getByText('Filter')
    fireEvent.click(filterButton)
    
    await waitFor(() => {
      expect(screen.getByText('Lendsqr')).toBeInTheDocument()
    })
  })

  it('handles pagination correctly', () => {
    const manyUsers = Array.from({ length: 25 }, (_, i) => ({
      ...mockUsers[0],
      id: `user_${i.toString().padStart(3, '0')}`,
      userName: `testuser${i}`,
      email: `test${i}@example.com`
    }))
    
    render(<UserTable users={manyUsers} isLoading={false} />)
    
    // Should show pagination controls
    expect(screen.getByText('out of 25')).toBeInTheDocument()
    
    // Should show only first 10 users by default
    expect(screen.getByText('testuser0')).toBeInTheDocument()
    expect(screen.queryByText('testuser15')).not.toBeInTheDocument()
  })

  it('shows action dropdown when more button is clicked', () => {
    render(<UserTable users={mockUsers} isLoading={false} />)
    
    const moreButton = screen.getByRole('button', { name: /more/i })
    fireEvent.click(moreButton)
    
    expect(screen.getByText('View Details')).toBeInTheDocument()
    expect(screen.getByText('Blacklist User')).toBeInTheDocument()
    expect(screen.getByText('Activate User')).toBeInTheDocument()
  })
})