import { useEffect, useState } from 'react'
import { getProducts } from '../../api/products'
import type { Product } from '../../types'
import { Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StaffDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Staff Dashboard</h2>

      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 w-fit">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Package size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Inventory</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Description</th>
              <th className="pb-3">Unit</th>
              <th className="pb-3">In Stock</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-gray-500">{p.description || '—'}</td>
                <td className="py-3 text-gray-500">{p.unit}</td>
                <td className="py-3">{p.quantityInStock}</td>
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
    </div>
  )
}
