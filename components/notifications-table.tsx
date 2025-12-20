// components/notifications-table.tsx
"use client"

import { useState, useMemo, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Notification, NotificationStatus } from "@/types/notifications"
import { updateNotificationStatus } from "@/app/dashboard/action"
import { NotificationsNavbar } from "@/components/notifications-navbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import type { FilterValues } from "@/components/notifications-filters"

interface NotificationsTableProps {
  initialNotifications: Notification[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasMore?: boolean
    lastKey?: string
  }
  initialFilters?: Record<string, string>
  onLogout: () => void
}

type FilterStatus = "all" | "pending" | "validated" | "rejected"

const statusConfig: Record<NotificationStatus, {
  label: string;
  variant: "warning" | "success" | "destructive"
}> = {
  pending: { label: "Pendiente", variant: "warning" },
  validated: { label: "Validada", variant: "success" },
  rejected: { label: "Rechazada", variant: "destructive" },
}

export function NotificationsTable({
  initialNotifications,
  pagination,
  initialFilters = {},
  onLogout
}: NotificationsTableProps) {
  console.log('🎨 NotificationsTable render', {
    notificationCount: initialNotifications.length,
    pagination,
    initialFilters,
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(initialNotifications) ? initialNotifications : []
  )
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterStatus>(
    (initialFilters.status as FilterStatus) || "all"
  )
  const [searchQuery, setSearchQuery] = useState("")

  // Parsear filtros iniciales desde URL
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({
    code: initialFilters.code,
    deviceId: initialFilters.deviceId,
    status: initialFilters.status,
    amountMin: initialFilters.amountMin,
    amountMax: initialFilters.amountMax,
    dateFrom: initialFilters.dateFrom,
    dateTo: initialFilters.dateTo,
  })

  const validNotifications = useMemo(() => {
    return notifications.filter((n) => n && n.id)
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    let filtered = validNotifications

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((n) => {
        const code = (n.code || "").toLowerCase()
        const device = (n.device_id || "").toLowerCase()
        const name = (n.name || "").toLowerCase()
        return code.includes(query) || device.includes(query) || name.includes(query)
      })
    }

    return filtered
  }, [validNotifications, searchQuery])

  const counts = useMemo(() => {
    return {
      pending: validNotifications.filter((n) => n.status === "pending").length,
      validated: validNotifications.filter((n) => n.status === "validated").length,
      rejected: validNotifications.filter((n) => n.status === "rejected").length,
    }
  }, [validNotifications])

  const handleStatusChange = async (id: string, newStatus: NotificationStatus) => {
    console.log('🔄 Changing status', { id, newStatus })
    setUpdatingIds((prev) => new Set(prev).add(id))

    try {
      const result = await updateNotificationStatus(id, newStatus)

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: newStatus } : notif
          )
        )
        toast.success("Estado actualizado", {
          description: `La notificación ha sido ${statusConfig[newStatus].label.toLowerCase()}.`,
        })
      } else {
        toast.error("Error al actualizar", {
          description: result.error || "No se pudo actualizar el estado",
        })
      }
    } catch (error) {
      toast.error("Error inesperado", {
        description: "Ocurrió un error al procesar la solicitud",
      })
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const updateFiltersInURL = (newFilters: FilterValues, newStatus?: FilterStatus) => {
    console.log('🔄 Updating filters in URL', { newFilters, newStatus })

    const params = new URLSearchParams(searchParams.toString())

    params.set('page', '1')
    params.delete('lastKey') 

    if (newFilters.code) {
      params.set('code', newFilters.code)
    } else {
      params.delete('code')
    }

    if (newFilters.deviceId) {
      params.set('deviceId', newFilters.deviceId)
    } else {
      params.delete('deviceId')
    }

    const status = newStatus || newFilters.status
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    if (newFilters.amountMin) {
      params.set('amountMin', newFilters.amountMin)
    } else {
      params.delete('amountMin')
    }

    if (newFilters.amountMax) {
      params.set('amountMax', newFilters.amountMax)
    } else {
      params.delete('amountMax')
    }

    if (newFilters.dateFrom) {
      params.set('dateFrom', newFilters.dateFrom)
    } else {
      params.delete('dateFrom')
    }

    if (newFilters.dateTo) {
      params.set('dateTo', newFilters.dateTo)
    } else {
      params.delete('dateTo')
    }

    const newURL = `/dashboard?${params.toString()}`

    startTransition(() => {
      router.push(newURL)
    })
  }

  const handleFilterChange = (status: FilterStatus) => {
    console.log('🏷️ Filter changed to:', status)
    setActiveFilter(status)
    updateFiltersInURL(advancedFilters, status)
  }

  const handlePageChange = (newPage: number) => {
    console.log('📄 Page changed to:', newPage)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())

    // Si hay lastKey y vamos a la siguiente página, incluirlo
    if (pagination.hasMore && newPage > pagination.page && pagination.lastKey) {
      params.set('lastKey', pagination.lastKey)
    } else if (newPage < pagination.page) {
      // Si retrocedemos, quitamos el lastKey
      params.delete('lastKey')
    }

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  const handleAdvancedFilters = (filters: FilterValues) => {
    console.log('🔍 Advanced filters applied:', filters)
    setAdvancedFilters(filters)
    updateFiltersInURL(filters, activeFilter)

    toast.success("Filtros aplicados", {
      description: "Buscando en el servidor...",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
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

      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Indicador de carga */}
          {isPending && (
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando resultados desde el servidor...
            </div>
          )}

          <div className="rounded-lg border shadow-sm bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Código</TableHead>
                  <TableHead className="w-[200px]">Nombre</TableHead>
                  <TableHead className="w-[110px]">Monto</TableHead>
                  <TableHead className="w-[140px]">Dispositivo</TableHead>
                  <TableHead className="w-[110px]">Estado</TableHead>
                  <TableHead className="w-[160px]">Fecha</TableHead>
                  <TableHead className="w-[150px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {isPending
                        ? "Cargando notificaciones..."
                        : "No se encontraron notificaciones"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const isUpdating = updatingIds.has(notification.id)
                    const config = statusConfig[notification.status] || statusConfig.pending
                    const date = notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString("es-ES", {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "-"

                    const key = notification.id || `notification-${index}`

                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium truncate">
                          {notification.code || "-"}
                        </TableCell>
                        <TableCell className="truncate">{notification.name || "-"}</TableCell>
                        <TableCell className="truncate">
                          {notification.amount
                            ? `S/ ${typeof notification.amount === 'number'
                                ? notification.amount.toFixed(2)
                                : notification.amount}`
                            : "-"
                          }
                        </TableCell>
                        <TableCell className="truncate text-sm text-muted-foreground">
                          {notification.device_id || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant} className="whitespace-nowrap">
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{date}</TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={notification.status}
                            onValueChange={(value) =>
                              handleStatusChange(notification.id, value as NotificationStatus)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-[130px] ml-auto">
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="validated">Validar</SelectItem>
                              <SelectItem value="rejected">Rechazar</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {/* Controles de paginación */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredNotifications.length} de {pagination.total} notificaciones
                {Object.keys(advancedFilters).filter(k => advancedFilters[k as keyof FilterValues]).length > 0 && (
                  <span className="ml-2 text-primary">
                    (con filtros)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="text-sm">
                  Página {pagination.page}
                  {pagination.hasMore && " de muchas"}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore || isPending}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}