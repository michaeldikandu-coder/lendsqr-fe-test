'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiArrowDropDownLine } from 'react-icons/ri'
import './sidebar.scss'

const menuItems = [
  {
    category: 'CUSTOMERS',
    items: [
      { name: 'Users', icon: '/images/user.png', path: '/dashboard' },
      { name: 'Guarantors', icon: '/images/gurantor.png', path: '/guarantors' },
      { name: 'Loans', icon: '/images/loans.png', path: '/loans' },
      { name: 'Decision Models', icon: '/images/handshake.png', path: '/decision-models' },
      { name: 'Savings', icon: '/images/savings.png', path: '/savings' },
      { name: 'Loan Requests', icon: '/images/request.png', path: '/loan-requests' },
      { name: 'Whitelist', icon: '/images/white-list.png', path: '/whitelist' },
      { name: 'Karma', icon: '/images/karma.png', path: '/karma' },
    ]
  },
  {
    category: 'BUSINESSES',
    items: [
      { name: 'Organization', icon: '/images/briefcase.png', path: '/organization' },
      { name: 'Loan Products', icon: '/images/request.png', path: '/loan-products' },
      { name: 'Savings Products', icon: '/images/bank.png', path: '/savings-products' },
      { name: 'Fees and Charges', icon: '/images/fees.png', path: '/fees-charges' },
      { name: 'Transactions', icon: '/images/transaction.png', path: '/transactions' },
      { name: 'Services', icon: '/images/galaxy.png', path: '/services' },
      { name: 'Service Account', icon: '/images/user.png', path: '/service-account' },
      { name: 'Settlements', icon: '/images/settlements.png', path: '/settlements' },
      { name: 'Reports', icon: '/images/reports.png', path: '/reports' },
    ]
  },
  {
    category: 'SETTINGS',
    items: [
      { name: 'Preferences', icon: '/images/preferences.png', path: '/preferences' },
      { name: 'Fees and Pricing', icon: '/images/fees.png', path: '/fees-pricing' },
      { name: 'Audit Logs', icon: '/images/clipboard.png', path: '/audit-logs' },
      { name: 'Systems Messages', icon: '/images/tire.png', path: '/system-messages' },
    ]
  }
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="organization-selector">
          <Image 
            src="/images/briefcase.png" 
            alt="Organization" 
            width={16}
            height={16}
          />
          <span>Switch Organization</span>
          <RiArrowDropDownLine />
        </div>
        
        <Link href="/dashboard" className="dashboard-link">
          <Image 
            src="/images/home.png" 
            alt="Dashboard" 
            width={16}
            height={16}
          />
          <span>Dashboard</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((section) => (
          <div key={section.category} className="nav-section">
            <h3 className="section-title">{section.category}</h3>
            <ul className="nav-list">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.path}
                    className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                  >
                    <Image 
                      src={item.icon} 
                      alt={item.name} 
                      width={16}
                      height={16}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <Link href="/logout" className="logout-link">
          <Image 
            src="/images/sign-out.png" 
            alt="Logout" 
            width={16}
            height={16}
          />
          <span>Logout</span>
        </Link>
        <div className="version">v1.2.0</div>
      </div>
    </aside>
  )
}