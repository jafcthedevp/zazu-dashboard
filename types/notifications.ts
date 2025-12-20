import { z } from "zod"

// Estados posibles de una notificación
export const NotificationStatusEnum = z.enum(["pending", "validated", "rejected"])
export type NotificationStatus = z.infer<typeof NotificationStatusEnum>

// Schema para actualizar estado
export const UpdateStatusSchema = z.object({
  status: NotificationStatusEnum,
})

export type UpdateStatusPayload = z.infer<typeof UpdateStatusSchema>

export interface Notification {
  id: string
  code: string
  name: string
  status: NotificationStatus
  timestamp: number // timestamp en milisegundos
  amount?: number
  device_id?: string
}

// Paginación
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasMore: boolean
  lastKey?: string
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}
