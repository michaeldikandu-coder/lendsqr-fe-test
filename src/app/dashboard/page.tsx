'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar/Navbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import UserStats from '@/components/UserStats/UserStats'
import UserTable from '@/components/UserTable/UserTable'
import { SearchProvider } from '@/contexts/SearchContext'
import { User, UserStats as UserStatsType } from '@/types/user'
import { mockApi } from '@/utils/mockApi'
import { storageUtils } from '@/utils/storage'
import './dashboard.scss'

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = storageUtils.getAuthToken()
    if (!token) {
      router.push('/login')
      return
    }

    // Load data
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load users from storage first, then fetch fresh data
      const cachedUsers = storageUtils.getUsers()
      if (cachedUsers.length > 0) {
        setUsers(cachedUsers)
      }

      // Fetch fresh data
      const [usersData, statsData] = await Promise.all([
        mockApi.getUsers(),
        mockApi.getUserStats()
      ])

      setUsers(usersData)
      setUserStats(statsData)
      
      // Cache the users data
      storageUtils.saveUsers(usersData)
      
    } catch (error) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-content">
            <div className="error-container">
              <p>{error}</p>
              <button onClick={loadDashboardData}>Retry</button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <SearchProvider>
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-content">
            <div className="dashboard-header">
              <h1>Users</h1>
            </div>
            
            {userStats && <UserStats stats={userStats} />}
            
            <UserTable users={users} isLoading={isLoading} />
          </main>
        </div>
      </div>
    </SearchProvider>
  )
}