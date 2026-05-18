import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'


export default function Navbar() {
  const { name, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatRole = (role: string | null) => {
    if (!role) return ''
    return role.replace(/_/g, ' ')
  }

  return (
    
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Inventory Management System</h1>
        <p className="text-xs text-gray-500">{formatRole(role)}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-medium">{name}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  )
}

