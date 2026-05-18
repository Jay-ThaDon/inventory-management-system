import { useEffect, useState } from 'react'
import { getProducts, getLowStockProducts } from '../../api/products'
import { getOrders, updateOrderStatus } from '../../api/orders'
import type { Product, PurchaseOrder } from '../../types'
import { Package, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WarehouseDashboard() {
  
  const [products, setProducts] = useState<Product[]>([])
  const [lowStock, setLowStock] = useState<Product[]>([])
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [p, l, o] = await Promise.all([
        getProducts(),
        getLowStockProducts(),
        getOrders()
      ])
      setProducts(p)
      setLowStock(l)
      setOrders(o)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeliver = async (id: number) => {
    try {
      await updateOrderStatus(id, 'DELIVERED')
      toast.success('Order marked as delivered')
      fetchAll()
    } catch {
      toast.error('Failed to update order')
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Warehouse Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Package size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-800">{lowStock.length}</p>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4">⚠ Low Stock Alerts</h3>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-white rounded-xl px-4 py-3">
                <span className="font-medium text-gray-800">{p.name}</span>
                <span className="text-sm text-red-600">{p.quantityInStock} / {p.minimumThreshold} min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Products</h3>
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
                  {p.lowStock
                    ? <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">Low Stock</span>
                    : <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">OK</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Approved Orders — Awaiting Delivery</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Product</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.filter(o => o.status === 'APPROVED').map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 font-medium">{o.productName}</td>
                <td className="py-3 text-gray-500">{o.supplierName}</td>
                <td className="py-3">{o.quantity}</td>
                <td className="py-3">
                  <button
                    onClick={() => handleDeliver(o.id)}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}
            {orders.filter(o => o.status === 'APPROVED').length === 0 && (
              <tr><td colSpan={4} className="py-4 text-center text-gray-400">No approved orders awaiting delivery</td></tr>
            )}

          </tbody>
        </table>
      </div>
    </div>

  )

}


