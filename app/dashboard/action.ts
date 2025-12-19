'use server';

import { revalidatePath } from 'next/cache';
import { notificationsApi, DEFAULT_PAGE_SIZE } from '@/lib/api-client';
import { UpdateStatusSchema, type NotificationStatus } from '@/types/notifications';

export async function updateNotificationStatus(
  id: string,
  status: NotificationStatus
) {
  try {
    const validatedData = UpdateStatusSchema.parse({ status });
    const updatedNotification = await notificationsApi.updateStatus(id, validatedData);

    revalidatePath('/dashboard');

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

/**
 * Obtener notificaciones con filtros avanzados
 */
export async function getNotifications(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters?: {
    code?: string;
    deviceId?: string;
    status?: string;
    amountMin?: string;
    amountMax?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) {
  try {
    let response;

    // Si hay filtros, usar el endpoint de búsqueda
    if (filters && Object.keys(filters).length > 0) {
      response = await notificationsApi.search({
        code: filters.code,
        deviceId: filters.deviceId,
        status: filters.status,
        amountMin: filters.amountMin ? parseFloat(filters.amountMin) : undefined,
        amountMax: filters.amountMax ? parseFloat(filters.amountMax) : undefined,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        page,
        pageSize,
      });
    } 
    // Si solo se filtra por estado, usar endpoint específico
    else if (filters?.status && filters.status !== 'all') {
      response = await notificationsApi.getByStatus(
        filters.status as 'pending' | 'validated' | 'rejected',
        page,
        pageSize
      );
    }
    // Si solo se filtra por dispositivo, usar endpoint específico
    else if (filters?.deviceId) {
      response = await notificationsApi.getByDevice(filters.deviceId, page, pageSize);
    }
    // Si no hay filtros, obtener todas
    else {
      response = await notificationsApi.getAll(page, pageSize);
    }

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

/**
 * Obtener una notificación específica por ID
 */
export async function getNotificationById(id: string) {
  try {
    const notification = await notificationsApi.getById(id);
    
    return {
      success: true,
      data: notification,
    };
  } catch (error) {
    console.error('Error fetching notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar notificación',
    };
  }
}