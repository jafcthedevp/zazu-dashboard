'use server';

import { revalidatePath } from 'next/cache';
import { notificationsApi } from '@/lib/api-client';
import { UpdateStatusSchema, type NotificationStatus } from '@/types/notifications';

export async function updateNotificationStatus(
  id: string, 
  status: NotificationStatus
) {
  try {
    const validatedData = UpdateStatusSchema.parse({ status });
    const updatedNotification = await notificationsApi.updateStatus(id, validatedData);
    
    revalidatePath('/dashboard/notifications');
    
    return {
      success: true,
      data: updatedNotification,
    };
  } catch (error) {
    console.error('Error updating notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function getNotifications(page: number = 1, pageSize: number = 20) {
  try {
    // AHORA SÍ PASAMOS LOS PARÁMETROS
    const response = await notificationsApi.getAll(page, pageSize);
    
    return {
      success: true,
      data: response.data,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar notificaciones',
      data: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
      }
    };
  }
}