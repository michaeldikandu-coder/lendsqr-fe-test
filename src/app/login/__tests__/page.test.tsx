import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'
import { mockApi } from '@/utils/mockApi'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock storage utils
jest.mock('@/utils/storage', () => ({
  storageUtils: {
    saveAuthToken: jest.fn(),
  },
}))

// Mock API
jest.mock('@/utils/mockApi', () => ({
  mockApi: {
    login: jest.fn(),
  },
}))

const mockPush = jest.fn()

describe('LoginPage', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByPlaceholderText('Password')
    const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('handles successful login', async () => {
    ;(mockApi.login as jest.Mock).mockResolvedValue({
      success: true,
      token: 'mock_token_123'
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles login failure', async () => {
    ;(mockApi.login as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Invalid credentials'
    })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    ;(mockApi.login as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true, token: 'token' }), 100))
    )
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    expect(screen.getByText('LOGGING IN...')).toBeInTheDocument()
    expect(loginButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('validates required fields', async () => {
    render(<LoginPage />)
    
    const loginButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(loginButton)
    
    // Form should not submit without required fields
    expect(mockApi.login).not.toHaveBeenCalled()
  })

  it('handles API error gracefully', async () => {
    ;(mockApi.login as jest.Mock).mockRejectedValue(new Error('Network error'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred during login')).toBeInTheDocument()
    })
  })
})