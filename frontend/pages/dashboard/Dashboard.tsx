import { useAuthStore } from '../../store/authStore'
import DashboardLayout from '../../components/DashboardLayout'
import AdminDashboard from './AdminDashboard'
import WarehouseDashboard from './WarehouseDashboard'
import ProcurementDashboard from './ProcurementDashboard'
import StaffDashboard from './StaffDashboard'


export default function Dashboard() {
  const role = useAuthStore((state) => state.role)

  const renderDashboard = () => {
    switch (role) {
      case 'ADMIN': return <AdminDashboard />
      case 'WAREHOUSE_MANAGER': return <WarehouseDashboard />
      case 'PROCUREMENT_OFFICER': return <ProcurementDashboard />
      case 'STAFF': return <StaffDashboard />
      default: return <p>Unknown role</p>
    }
  }


  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}

