'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { IoIosMore } from 'react-icons/io'
import { User } from '@/types/user'
import { storageUtils } from '@/utils/storage'
import { useSearch } from '@/contexts/SearchContext'
import FilterModal from './FilterModal'
import Pagination from './Pagination'
import './userTable.scss'

interface UserTableProps {
  users: User[]
  isLoading: boolean
}

export default function UserTable({ users, isLoading }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filterPosition, setFilterPosition] = useState({ column: '', element: null as HTMLElement | null })
  const [filters, setFilters] = useState({
    organization: '',
    username: '',
    email: '',
    date: '',
    phoneNumber: '',
    status: ''
  })
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { searchQuery } = useSearch()
  const router = useRouter()

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilterModal) {
        const target = event.target as HTMLElement
        const filterDropdown = document.querySelector('.filter-dropdown')
        const filterButton = document.querySelector('.filter-btn')
        
        if (filterDropdown && !filterDropdown.contains(target) && !filterButton?.contains(target)) {
          setShowFilterModal(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterModal])

  // Filter users based on current filters and search query
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search functionality - search across multiple fields
      const matchesSearch = !searchQuery || 
        user.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber.includes(searchQuery) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.profile.firstName} ${user.profile.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter functionality
      const matchesFilters = (
        (!filters.organization || user.orgName.toLowerCase().includes(filters.organization.toLowerCase())) &&
        (!filters.username || user.userName.toLowerCase().includes(filters.username.toLowerCase())) &&
        (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.phoneNumber || user.phoneNumber.includes(filters.phoneNumber)) &&
        (!filters.status || user.status === filters.status) &&
        (!filters.date || user.dateJoined.includes(filters.date))
      )

      return matchesSearch && matchesFilters
    })
  }, [users, filters, searchQuery])

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleUserClick = (user: User) => {
    storageUtils.saveSelectedUser(user)
    router.push(`/users/${user.id}`)
  }

  const handleFilterClick = (e: React.MouseEvent, column: string) => {
    e.stopPropagation()
    const buttonElement = e.currentTarget as HTMLElement
    
    // If clicking the same filter button, toggle the dropdown
    if (showFilterModal && filterPosition.column === column) {
      setShowFilterModal(false)
    } else {
      setFilterPosition({ column, element: buttonElement })
      setShowFilterModal(true)
    }
  }

  const handleFilterApply = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setShowFilterModal(false)
  }

  const handleFilterReset = () => {
    setFilters({
      organization: '',
      username: '',
      email: '',
      date: '',
      phoneNumber: '',
      status: ''
    })
    setCurrentPage(1)
    setShowFilterModal(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
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

  const handleActionClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === userId ? null : userId)
  }

  return (
    <div className="user-table-container">
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>
                <div className="header-cell">
                  ORGANIZATION
                  <button 
                    className="filter-btn"
                    onClick={(e) => handleFilterClick(e, 'organization')}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                  {showFilterModal && filterPosition.column === 'organization' && (
                    <FilterModal
                      filters={filters}
                      onApply={handleFilterApply}
                      onReset={handleFilterReset}
                      onClose={() => setShowFilterModal(false)}
                    />
                  )}
                </div>
              </th>
              <th>
                <div className="header-cell">
                  USERNAME
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="header-cell">
                  EMAIL
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="header-cell">
                  PHONE NUMBER
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="header-cell">
                  DATE JOINED
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="header-cell">
                  STATUS
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Image src="/images/filter.png" alt="Filter" width={16} height={16} />
                  </button>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr 
                key={user.id} 
                onClick={() => handleUserClick(user)}
                className="user-row"
              >
                <td>{user.orgName}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{formatDate(user.dateJoined)}</td>
                <td>
                  <span className={`status ${getStatusClass(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-cell">
                    <button 
                      className="action-btn"
                      onClick={(e) => handleActionClick(e, user.id)}
                    >
                      <IoIosMore />
                    </button>
                    {activeDropdown === user.id && (
                      <div className="action-dropdown">
                        <button onClick={() => handleUserClick(user)}>
                          <Image src="/images/np_view_1214519_000000 1.png" alt="View" width={16} height={16} />
                          View Details
                        </button>
                        <button>
                          <Image src="/images/np_delete-friend_3248001_000000 1.png" alt="Blacklist" width={16} height={16} />
                          Blacklist User
                        </button>
                        <button>
                          <Image src="/images/np_user_2995993_000000 1.png" alt="Activate" width={16} height={16} />
                          Activate User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  )
}