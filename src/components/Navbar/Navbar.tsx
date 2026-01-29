'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IoIosNotificationsOutline, IoIosSearch } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { storageUtils } from '@/utils/storage'
import './navbar.scss'

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    storageUtils.removeAuthToken()
    router.push('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Image 
          src="/images/Group.svg" 
          alt="LendSqr Logo" 
          width={144}
          height={30}
          priority
        />
      </div>
      
      <div className="navbar-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for anything"
            className="search-input"
          />
          <button className="search-button">
            <IoIosSearch />
          </button>
        </div>
      </div>
      
      <div className="navbar-right">
        <a href="#" className="docs-link">Docs</a>
        
        <div className="notification-icon">
          <IoIosNotificationsOutline />
        </div>
        
        <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <Image 
            src="/images/profile.png" 
            alt="User Avatar" 
            width={48}
            height={48}
            className="avatar"
          />
          <span className="username">Adedeji</span>
          <RiArrowDropDownLine className="dropdown-arrow" />
          
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}