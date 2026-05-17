import { ReactNode } from 'react'
import Navbar from './Navbar'

interface Props {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        {children}
      </main>
    </div>
    
  )
}

