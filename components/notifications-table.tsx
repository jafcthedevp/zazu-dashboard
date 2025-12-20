"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, X, Clock, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NotificationsNavbar } from "@/components/notifications-navbar"
import type { FilterValues } from "@/components/notifications-filters"
import { updateNotificationStatus } from "@/app/dashboard/action"
import type { Notification, NotificationStatus, PaginationInfo } from "@/types/notifications"

type FilterStatus = "all" | "pending" | "validated" | "rejected"

interface NotificationsTableProps {
  initialNotifications: Notification[]
  pagination: PaginationInfo
  initialFilters: Record<string, string>
  onLogout: () => void
}

const statusConfig: Record<
  NotificationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
> = {
  pending: { label: "Pendiente", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  validated: { label: "Validada", variant: "default", icon: <Check className="h-3 w-3" /> },
  rejected: { label: "Rechazada", variant: "destructive", icon: <X className="h-3 w-3" /> },
}

export function NotificationsTable({
  initialNotifications,
  pagination,
  initialFilters,
  onLogout,
}: NotificationsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [notifications, setNotifications] = useState(initialNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  const activeFilter = (initialFilters.status as FilterStatus) || "all"

  const advancedFilters: FilterValues = {
    code: initialFilters.code,
    deviceId: initialFilters.deviceId,
    amountMin: initialFilters.amountMin,
    amountMax: initialFilters.amountMax,
    dateFrom: initialFilters.dateFrom,
    dateTo: initialFilters.dateTo,
  }

  const counts = useMemo(() => {
    return {
      pending: notifications.filter((n) => n.status === "pending").length,
      validated: notifications.filter((n) => n.status === "validated").length,
      rejected: notifications.filter((n) => n.status === "rejected").length,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    if (!searchQuery) return notifications

    const query = searchQuery.toLowerCase()
    return notifications.filter(
      (n) =>
        n.code?.toLowerCase().includes(query) ||
        n.name?.toLowerCase().includes(query) ||
        n.device_id?.toLowerCase().includes(query) ||
        n.amount?.toString().includes(query),
    )
  }, [notifications, searchQuery])

  const updateUrlParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("page")
    params.delete("lastKey")

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/dashboard?${params.toString()}`)
  }

  const handleFilterChange = (status: FilterStatus) => {
    updateUrlParams({ status: status === "all" ? undefined : status })
  }

  const handleAdvancedFilters = (filters: FilterValues) => {
    updateUrlParams({
      ...filters,
      status: activeFilter === "all" ? undefined : activeFilter,
    })
  }

  const handleStatusUpdate = async (id: string, newStatus: NotificationStatus) => {
    setIsUpdating(id)
    try {
      const result = await updateNotificationStatus(id, newStatus)
      if (result.success) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n)))
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    if (pagination.lastKey && newPage > pagination.page) {
      params.set("lastKey", pagination.lastKey)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "-"
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NotificationsNavbar
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        counts={counts}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdvancedFilters={handleAdvancedFilters}
        advancedFilters={advancedFilters}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {activeFilter !== "all" && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrando:</span>
            <Badge variant={statusConfig[activeFilter].variant}>
              {statusConfig[activeFilter].icon}
              <span className="ml-1">{statusConfig[activeFilter].label}s</span>
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => handleFilterChange("all")} className="h-6 px-2 text-xs">
              Limpiar filtro
            </Button>
          </div>
        )}

        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Clock className="h-8 w-8" />
                      <p>
                        No hay notificaciones{" "}
                        {activeFilter !== "all" ? statusConfig[activeFilter].label.toLowerCase() + "s" : ""}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification) => {
                  const config = statusConfig[notification.status]
                  return (
                    <TableRow key={notification.id}>
                      <TableCell className="font-mono text-sm">{notification.code}</TableCell>
                      <TableCell>{notification.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {notification.device_id || "-"}
                      </TableCell>
                      <TableCell className="font-medium">{formatAmount(notification.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          {config.icon}
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(notification.timestamp)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isUpdating === notification.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {notification.status !== "validated" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(notification.id, "validated")}>
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                Validar
                              </DropdownMenuItem>
                            )}
                            {notification.status !== "rejected" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(notification.id, "rejected")}>
                                <X className="mr-2 h-4 w-4 text-red-500" />
                                Rechazar
                              </DropdownMenuItem>
                            )}
                            {notification.status !== "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(notification.id, "pending")}>
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                Marcar pendiente
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredNotifications.length} de {pagination.total} notificaciones
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">Página {pagination.page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
