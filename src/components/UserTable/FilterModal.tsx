'use client'

import { useState } from 'react'
import './filterModal.scss'

interface FilterModalProps {
  filters: {
    organization: string
    username: string
    email: string
    date: string
    phoneNumber: string
    status: string
  }
  onApply: (filters: any) => void
  onReset: () => void
  onClose: () => void
}

export default function FilterModal({ filters, onApply, onReset, onClose }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApply = () => {
    onApply(localFilters)
  }

  const handleReset = () => {
    setLocalFilters({
      organization: '',
      username: '',
      email: '',
      date: '',
      phoneNumber: '',
      status: ''
    })
    onReset()
  }

  return (
    <div className="filter-dropdown">
      <div className="filter-form">
        <div className="form-group">
          <label>Organization</label>
          <select
            value={localFilters.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Lendsqr">Lendsqr</option>
            <option value="Irorun">Irorun</option>
            <option value="Lendstar">Lendstar</option>
            <option value="Paystack">Paystack</option>
            <option value="Flutterwave">Flutterwave</option>
          </select>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="User"
            value={localFilters.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={localFilters.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={localFilters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={localFilters.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={localFilters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Blacklisted">Blacklisted</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
        <button className="filter-btn" onClick={handleApply}>
          Filter
        </button>
      </div>
    </div>
  )
}