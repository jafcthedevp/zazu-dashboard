"use server"

import { revalidatePath } from "next/cache"
import { notificationsApi, DEFAULT_PAGE_SIZE } from "@/lib/api-client"
import { UpdateStatusSchema, type NotificationStatus } from "@/types/notifications"

export async function updateNotificationStatus(id: string, status: NotificationStatus) {
  try {
    const validatedData = UpdateStatusSchema.parse({ status })
    const updatedNotification = await notificationsApi.updateStatus(id, validatedData)
    revalidatePath("/dashboard")
    return { success: true, data: updatedNotification }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

export async function getNotifications(
  page = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters?: {
    code?: string
    deviceId?: string
    status?: string
    amountMin?: string
    amountMax?: string
    dateFrom?: string
    dateTo?: string
    lastKey?: string
  },
) {
  try {
    let response

    const hasComplexFilters =
      filters && (filters.code || filters.amountMin || filters.amountMax || filters.dateFrom || filters.dateTo)

    if (hasComplexFilters) {
      response = await notificationsApi.search({
        code: filters!.code,
        deviceId: filters!.deviceId,
        status: filters!.status,
        amountMin: filters!.amountMin ? Number.parseFloat(filters!.amountMin) : undefined,
        amountMax: filters!.amountMax ? Number.parseFloat(filters!.amountMax) : undefined,
        dateFrom: filters!.dateFrom,
        dateTo: filters!.dateTo,
        page,
        pageSize,
        lastKey: filters!.lastKey,
      })
    } else if (filters?.status && filters.status !== "all") {
      response = await notificationsApi.getByStatus(
        filters.status as "pending" | "validated" | "rejected",
        page,
        pageSize,
        filters.lastKey,
      )
    } else if (filters?.deviceId) {
      response = await notificationsApi.getByDevice(filters.deviceId, page, pageSize, filters.lastKey)
    } else {
      response = await notificationsApi.getAll(page, pageSize, filters?.lastKey)
    }

    return {
      success: true,
      data: response.data,
      pagination: response.pagination,
    }
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al cargar notificaciones",
      data: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    }
  }
}
