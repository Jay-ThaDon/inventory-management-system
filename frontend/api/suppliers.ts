import api from './axios'
import type{ Supplier } from '../types'

export const getSuppliers = async (): Promise<Supplier[]> => {
  const res = await api.get('/suppliers')
  return res.data
}

export const createSupplier = async (data: Omit<Supplier, 'id'>): Promise<Supplier> => {
  const res = await api.post('/suppliers', data)
  return res.data
}

export const updateSupplier = async (id: number, data: Omit<Supplier, 'id'>): Promise<Supplier> => {
  const res = await api.put(`/suppliers/${id}`, data)
  return res.data
}

export const deleteSupplier = async (id: number): Promise<void> => {
  await api.delete(`/suppliers/${id}`)
}


