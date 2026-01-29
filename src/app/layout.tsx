import type { Metadata } from 'next'
import { SearchProvider } from '@/contexts/SearchContext'
import './globals.scss'

export const metadata: Metadata = {
  title: 'LendSqr - Financial Dashboard',
  description: 'A comprehensive financial dashboard for managing users and loans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  )
}