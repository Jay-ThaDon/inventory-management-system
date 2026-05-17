export interface User {
  name: string
  email: string
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'PROCUREMENT_OFFICER' | 'STAFF'
}

export interface AuthResponse {
  token: string
  role: string
  name: string
}

export interface Product {
  id: number
  name: string
  description: string
  unit: string
  quantityInStock: number
  minimumThreshold: number
  lowStock: boolean
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

export interface PurchaseOrder {
  id: number
  productName: string
  supplierName: string
  raisedByName: string
  quantity: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELIVERED'
  notes: string
  createdAt: string
}

export interface Notification {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}


