import api from './axios'
import type { Product } from '../types'



export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products')
  return res.data
}

export const getLowStockProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products/low-stock')
  return res.data
}

export const createProduct = async (data: Omit<Product, 'id' | 'lowStock'>): Promise<Product> => {
  const res = await api.post('/products', data)
  return res.data
}

export const updateProduct = async (id: number, data: Omit<Product, 'id' | 'lowStock'>): Promise<Product> => {
  const res = await api.put(`/products/${id}`, data)
  return res.data
}

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`)
}

