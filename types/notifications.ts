import { z } from 'zod';

export const NotificationStatusSchema = z.enum(['pending', 'validated', 'rejected']);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

export const NotificationSchema = z.object({
  id: z.string(),
  // Campos reales devueltos por la API
  code: z.string(),
  name: z.string(),
  status: NotificationStatusSchema,
  // Puede venir como number (timestamp) o string — lo normalizamos a number
  timestamp: z.preprocess((val) => {
    if (typeof val === 'string') return Number(val);
    return val;
  }, z.number()),
  amount: z.number().optional(),
  device_id: z.string().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const UpdateStatusSchema = z.object({
  status: NotificationStatusSchema,
});

export type UpdateStatusPayload = z.infer<typeof UpdateStatusSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}