'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { mockApi } from '@/utils/mockApi'
import { storageUtils } from '@/utils/storage'
import './login.scss'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await mockApi.login(email, password)
      
      if (response.success && response.token) {
        storageUtils.saveAuthToken(response.token)
        router.push('/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-container">
          <Image 
            src="/images/Group.svg" 
            alt="LendSqr Logo" 
            width={173}
            height={36}
            priority
          />
        </div>
        <div className="illustration-container">
          <Image 
            src="/images/pablo-sign-in 1.svg" 
            alt="Sign In Illustration" 
            width={600}
            height={337}
            priority
          />
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <h1>Welcome!</h1>
          <p>Enter details to login.</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <a href="#" className="forgot-password">FORGOT PASSWORD?</a>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}