import api from './axios'
import type { PurchaseOrder } from '../types'

export const getOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await api.get('/orders')
  return res.data
}

export const getMyOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await api.get('/orders/my-orders')
  return res.data
}

export const createOrder = async (data: {
  productId: number
  supplierId: number
  quantity: number
  notes: string
}): Promise<PurchaseOrder> => {
  const res = await api.post('/orders', data)
  return res.data
}

export const updateOrderStatus = async (
  id: number,
  status: string
): Promise<PurchaseOrder> => {
  const res = await api.put(`/orders/${id}/status?status=${status}`)
  return res.data
}
