import { useEffect, useState } from 'react'
import { getProducts } from '../../api/products'
import { getSuppliers } from '../../api/suppliers'
import { getOrders, updateOrderStatus } from '../../api/orders'
import type { Product, Supplier, PurchaseOrder } from '../../types'
import { Package, Truck, ShoppingCart, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'


export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchAll()
  }, [])

  
  const fetchAll = async () => {
    try {
      const [p, s, o] = await Promise.all([
        getProducts(),
        getSuppliers(),
        getOrders()
      ])
      setProducts(p)
      setSuppliers(s)
      setOrders(o)
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status)
      toast.success(`Order ${status.toLowerCase()}`)
      fetchAll()
    } catch {
      toast.error('Failed to update order status')
    }
  }

  const lowStockCount = products.filter(p => p.lowStock).length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Package size={24} />} label="Total Products" value={products.length} color="blue" />
        <StatCard icon={<Truck size={24} />} label="Total Suppliers" value={suppliers.length} color="green" />
        <StatCard icon={<ShoppingCart size={24} />} label="Pending Orders" value={pendingOrders} color="yellow" />
        <StatCard icon={<AlertTriangle size={24} />} label="Low Stock Items" value={lowStockCount} color="red" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3">In Stock</th>
                <th className="pb-3">Min Threshold</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.unit}</td>
                  <td className="py-3">{p.quantityInStock}</td>
                  <td className="py-3">{p.minimumThreshold}</td>
                  <td className="py-3">
                    {p.lowStock ? (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Product</th>
                <th className="pb-3">Supplier</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Raised By</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{o.productName}</td>
                  <td className="py-3 text-gray-500">{o.supplierName}</td>
                  <td className="py-3">{o.quantity}</td>
                  <td className="py-3 text-gray-500">{o.raisedByName}</td>
                  <td className="py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3">
                    {o.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(o.id, 'APPROVED')}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(o.id, 'REJECTED')}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {o.status === 'APPROVED' && (
                      <button
                        onClick={() => handleStatusUpdate(o.id, 'DELIVERED')}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Suppliers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Address</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3 text-gray-500">{s.email}</td>
                  <td className="py-3 text-gray-500">{s.phone}</td>
                  <td className="py-3 text-gray-500">{s.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'green' | 'yellow' | 'red'
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-600',
    APPROVED: 'bg-blue-100 text-blue-600',
    REJECTED: 'bg-red-100 text-red-600',
    DELIVERED: 'bg-green-100 text-green-600',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>

  )

}

