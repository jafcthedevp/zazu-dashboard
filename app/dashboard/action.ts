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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

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
    lastKey?: string; // ← NUEVO: para cursor pagination
  }
) {

  try {
    let response;
    let endpointUsed = '';

    const hasComplexFilters = filters && (
      filters.code ||
      filters.amountMin ||
      filters.amountMax ||
      filters.dateFrom ||
      filters.dateTo
    );

    if (hasComplexFilters) {
      endpointUsed = 'search';

      response = await notificationsApi.search({
        code: filters!.code,
        deviceId: filters!.deviceId,
        status: filters!.status,
        amountMin: filters!.amountMin ? parseFloat(filters!.amountMin) : undefined,
        amountMax: filters!.amountMax ? parseFloat(filters!.amountMax) : undefined,
        dateFrom: filters!.dateFrom,
        dateTo: filters!.dateTo,
        page,
        pageSize,
        lastKey: filters!.lastKey,
      });
    } else if (filters?.status && filters.status !== 'all') {
      endpointUsed = 'status';

      response = await notificationsApi.getByStatus(
        filters.status as 'pending' | 'validated' | 'rejected',
        page,
        pageSize,
        filters.lastKey
      );
    } else if (filters?.deviceId) {
      endpointUsed = 'device';

      response = await notificationsApi.getByDevice(
        filters.deviceId,
        page,
        pageSize,
        filters.lastKey
      );
    } else {
      endpointUsed = 'getAll';

      response = await notificationsApi.getAll(page, pageSize, filters?.lastKey);
    }

    console.log('✅ getNotifications response:', {
      endpointUsed,
      recordsReceived: response.data.length,
      pagination: response.pagination,
      firstRecord: response.data[0],
    });

    return {
      success: true,
      data: response.data,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error('❌ getNotifications error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar notificaciones',
      data: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
        hasMore: false,
      }
    };
  }
}

export async function getNotificationById(id: string) {
  console.log('🔍 SERVER ACTION: getNotificationById', { id });

  try {
    const notification = await notificationsApi.getById(id);
    console.log('✅ Notification found:', notification);

    return {
      success: true,
      data: notification,
    };
  } catch (error) {
    console.error('❌ getNotificationById error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cargar notificación',
    };
  }
}