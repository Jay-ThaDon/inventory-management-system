import { useEffect, useState } from 'react'
import { getMyOrders, createOrder } from '../../api/orders'
import { getProducts } from '../../api/products'
import { getSuppliers } from '../../api/suppliers'
import type { PurchaseOrder, Product, Supplier } from '../../types'
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProcurementDashboard() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [productId, setProductId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [o, p, s] = await Promise.all([
        getMyOrders(),
        getProducts(),
        getSuppliers()
      ])
      setOrders(o)
      setProducts(p)
      setSuppliers(s)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!productId || !supplierId || !quantity) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      setSubmitting(true)
      await createOrder({
        productId: Number(productId),
        supplierId: Number(supplierId),
        quantity: Number(quantity),
        notes
      })
      toast.success('Purchase order created')
      setShowForm(false)
      setProductId('')
      setSupplierId('')
      setQuantity('')
      setNotes('')
      fetchAll()
    } catch {
      toast.error('Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-600',
    APPROVED: 'bg-blue-100 text-blue-600',
    REJECTED: 'bg-red-100 text-red-600',
    DELIVERED: 'bg-green-100 text-green-600',
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Procurement Dashboard</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Order'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Create Purchase Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={productId}
                onChange={e => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select
                value={supplierId}
                onChange={e => setSupplierId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Order'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><ShoppingCart size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">My Orders</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Purchase Orders</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Product</th>
              <th className="pb-3">Supplier</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3">Notes</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 font-medium">{o.productName}</td>
                <td className="py-3 text-gray-500">{o.supplierName}</td>
                <td className="py-3">{o.quantity}</td>
                <td className="py-3 text-gray-500">{o.notes || '—'}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{o.createdAt.split('T')[0]}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="py-4 text-center text-gray-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
  
}
