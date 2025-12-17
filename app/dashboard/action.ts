'use server';

import { revalidatePath } from 'next/cache';
import { notificationsApi } from '@/lib/api-client';
import { UpdateStatusSchema, type NotificationStatus } from '@/types/notifications';

export async function updateNotificationStatus(id: string, status: NotificationStatus) {
  try {
    // Validar con Zod
    const validatedData = UpdateStatusSchema.parse({ status });
    
    // Actualizar en la API
    const updatedNotification = await notificationsApi.updateStatus(id, validatedData);
    
    // Revalidar la ruta para actualizar los datos en el cliente
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

export async function getNotifications() {
  try {
    const notifications = await notificationsApi.getAll();
    
    // Asegurar que siempre sea un array
    const validatedData = Array.isArray(notifications) ? notifications : [];
    
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar notificaciones',
      data: [],
    };
  }
}