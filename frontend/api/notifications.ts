import api from './axios'
import type { Notification } from '../types'


export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications')
  return res.data
}

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications/unread')
  return res.data
}

export const markNotificationRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`)
}

