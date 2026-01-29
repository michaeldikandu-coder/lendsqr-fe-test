'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { IoIosArrowBack } from 'react-icons/io'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Navbar from '@/components/Navbar/Navbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import { User } from '@/types/user'
import { storageUtils } from '@/utils/storage'
import { mockApi } from '@/utils/mockApi'
import './userDetails.scss'

export default function UserDetailsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('generaldetails')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Check authentication
    const token = storageUtils.getAuthToken()
    if (!token) {
      router.push('/login')
      return
    }

    loadUserDetails()
  }, [params.id, router])

  const loadUserDetails = async () => {
    try {
      setIsLoading(true)
      
      // First try to get from localStorage
      const selectedUser = storageUtils.getSelectedUser()
      if (selectedUser && selectedUser.id === params.id) {
        setUser(selectedUser)
        setIsLoading(false)
        return
      }

      // If not found in localStorage, fetch from API
      const userData = await mockApi.getUserById(params.id as string)
      if (userData) {
        setUser(userData)
        storageUtils.saveSelectedUser(userData)
      } else {
        setError('User not found')
      }
    } catch (error) {
      setError('Failed to load user details')
      console.error('User details loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackClick = () => {
    router.push('/dashboard')
  }

  const getStatusClass = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'status-active'
      case 'Inactive': return 'status-inactive'
      case 'Pending': return 'status-pending'
      case 'Blacklisted': return 'status-blacklisted'
      default: return ''
    }
  }

  if (isLoading) {
    return (
      <div className="user-details-layout">
        <Navbar />
        <div className="user-details-content">
          <Sidebar />
          <main className="main-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading user details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="user-details-layout">
        <Navbar />
        <div className="user-details-content">
          <Sidebar />
          <main className="main-content">
            <div className="error-container">
              <p>{error || 'User not found'}</p>
              <button onClick={handleBackClick}>Back to Dashboard</button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="user-details-layout">
      <Navbar />
      <div className="user-details-content">
        <Sidebar />
        <main className="main-content">
          <div className="user-details-header">
            <button className="back-btn" onClick={handleBackClick}>
              <IoIosArrowBack />
              Back to Users
            </button>
            
            <div className="header-actions">
              <h1>User Details</h1>
              <div className="action-buttons">
                <button className="blacklist-btn">BLACKLIST USER</button>
                <button className="activate-btn">ACTIVATE USER</button>
              </div>
            </div>
          </div>

          <div className="user-summary-card">
            <div className="user-info">
              <div className="user-avatar">
                <img src={user.profile.avatar} alt={`${user.profile.firstName} ${user.profile.lastName}`} />
              </div>
              <div className="user-basic-info">
                <h2>{user.profile.firstName} {user.profile.lastName}</h2>
                <p>{user.userName}</p>
              </div>
            </div>
            
            <div className="user-tier">
              <p>User's Tier</p>
              <div className="stars">
                <AiFillStar />
                <AiOutlineStar />
                <AiOutlineStar />
              </div>
            </div>
            
            <div className="user-balance">
              <h3>₦{parseFloat(user.accountBalance).toLocaleString()}</h3>
              <p>{user.accountNumber}/Providus Bank</p>
            </div>
          </div>

          <div className="user-details-tabs">
            <div className="tab-navigation">
              {['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab.toLowerCase().replace(/\s+/g, '') ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, ''))}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'generaldetails' && (
                <div className="general-details">
                  <div className="details-section">
                    <h3>Personal Information</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>FULL NAME</label>
                        <p>{user.profile.firstName} {user.profile.lastName}</p>
                      </div>
                      <div className="detail-item">
                        <label>PHONE NUMBER</label>
                        <p>{user.profile.phoneNumber}</p>
                      </div>
                      <div className="detail-item">
                        <label>EMAIL ADDRESS</label>
                        <p>{user.email}</p>
                      </div>
                      <div className="detail-item">
                        <label>BVN</label>
                        <p>{user.profile.bvn}</p>
                      </div>
                      <div className="detail-item">
                        <label>GENDER</label>
                        <p>{user.profile.gender}</p>
                      </div>
                      <div className="detail-item">
                        <label>MARITAL STATUS</label>
                        <p>Single</p>
                      </div>
                      <div className="detail-item">
                        <label>CHILDREN</label>
                        <p>None</p>
                      </div>
                      <div className="detail-item">
                        <label>TYPE OF RESIDENCE</label>
                        <p>Parent's Apartment</p>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Education and Employment</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>LEVEL OF EDUCATION</label>
                        <p>{user.education.level}</p>
                      </div>
                      <div className="detail-item">
                        <label>EMPLOYMENT STATUS</label>
                        <p>{user.education.employmentStatus}</p>
                      </div>
                      <div className="detail-item">
                        <label>SECTOR OF EMPLOYMENT</label>
                        <p>{user.education.sector}</p>
                      </div>
                      <div className="detail-item">
                        <label>DURATION OF EMPLOYMENT</label>
                        <p>{user.education.duration}</p>
                      </div>
                      <div className="detail-item">
                        <label>OFFICE EMAIL</label>
                        <p>{user.education.officeEmail}</p>
                      </div>
                      <div className="detail-item">
                        <label>MONTHLY INCOME</label>
                        <p>{user.education.monthlyIncome.join(' - ')}</p>
                      </div>
                      <div className="detail-item">
                        <label>LOAN REPAYMENT</label>
                        <p>{user.education.loanRepayment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Socials</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>TWITTER</label>
                        <p>{user.socials.twitter}</p>
                      </div>
                      <div className="detail-item">
                        <label>FACEBOOK</label>
                        <p>{user.socials.facebook}</p>
                      </div>
                      <div className="detail-item">
                        <label>INSTAGRAM</label>
                        <p>{user.socials.instagram}</p>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Guarantor</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>FULL NAME</label>
                        <p>{user.guarantor.firstName} {user.guarantor.lastName}</p>
                      </div>
                      <div className="detail-item">
                        <label>PHONE NUMBER</label>
                        <p>{user.guarantor.phoneNumber}</p>
                      </div>
                      <div className="detail-item">
                        <label>EMAIL ADDRESS</label>
                        <p>{user.guarantor.firstName.toLowerCase()}.{user.guarantor.lastName.toLowerCase()}@gmail.com</p>
                      </div>
                      <div className="detail-item">
                        <label>RELATIONSHIP</label>
                        <p>Sister</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab !== 'generaldetails' && (
                <div className="placeholder-content">
                  <p>Content for {activeTab} tab will be implemented here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}