import Image from 'next/image'
import { UserStats as UserStatsType } from '@/types/user'
import './userStats.scss'

interface UserStatsProps {
  stats: UserStatsType
}

const statsConfig = [
  {
    title: 'USERS',
    icon: '/images/users.png',
    key: 'totalUsers' as keyof UserStatsType,
    color: '#DF18FF'
  },
  {
    title: 'ACTIVE USERS',
    icon: '/images/active.png',
    key: 'activeUsers' as keyof UserStatsType,
    color: '#5718FF'
  },
  {
    title: 'USERS WITH LOANS',
    icon: '/images/userloans.png',
    key: 'usersWithLoans' as keyof UserStatsType,
    color: '#F55F44'
  },
  {
    title: 'USERS WITH SAVINGS',
    icon: '/images/coins.png',
    key: 'usersWithSavings' as keyof UserStatsType,
    color: '#FF3366'
  }
]

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="user-stats">
      {statsConfig.map((config) => (
        <div key={config.title} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: `${config.color}1A` }}>
            <Image 
              src={config.icon} 
              alt={config.title} 
              width={40}
              height={40}
            />
          </div>
          <h3>{config.title}</h3>
          <p>{stats[config.key].toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}