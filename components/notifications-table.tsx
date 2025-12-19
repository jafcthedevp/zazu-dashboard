"use client"

import { useState, useMemo } from "react"
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
  }
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
  onLogout 
}: NotificationsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(initialNotifications) ? initialNotifications : []
  )
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({})

  // Filtrar notificaciones válidas
  const validNotifications = useMemo(() => {
    return notifications.filter((n) => n && n.id)
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    let filtered = validNotifications

    // Filtrar por estado
    if (activeFilter !== "all") {
      filtered = filtered.filter((n) => n.status === activeFilter)
    }

    // Filtrar por búsqueda rápida
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((n) => {
        const code = (n.code || "").toLowerCase()
        const device = (n.device_id || "").toLowerCase()
        return code.includes(query) || device.includes(query)
      })
    }

    // Aplicar filtros avanzados
    if (advancedFilters.code) {
      filtered = filtered.filter((n) =>
        n.code?.toLowerCase().includes(advancedFilters.code!.toLowerCase())
      )
    }

    if (advancedFilters.deviceId) {
      filtered = filtered.filter((n) =>
        n.device_id?.toLowerCase().includes(advancedFilters.deviceId!.toLowerCase())
      )
    }

    if (advancedFilters.status && advancedFilters.status !== 'all') {
      filtered = filtered.filter((n) => n.status === advancedFilters.status)
    }

    if (advancedFilters.amountMin) {
      const min = parseFloat(advancedFilters.amountMin)
      if (!isNaN(min)) {
        filtered = filtered.filter((n) => {
          const amount = typeof n.amount === 'string' ? parseFloat(n.amount) : n.amount
          return amount && amount >= min
        })
      }
    }

    if (advancedFilters.amountMax) {
      const max = parseFloat(advancedFilters.amountMax)
      if (!isNaN(max)) {
        filtered = filtered.filter((n) => {
          const amount = typeof n.amount === 'string' ? parseFloat(n.amount) : n.amount
          return amount && amount <= max
        })
      }
    }

    if (advancedFilters.dateFrom) {
      const from = new Date(advancedFilters.dateFrom)
      filtered = filtered.filter((n) => {
        if (!n.timestamp) return false
        const date = new Date(n.timestamp)
        return date >= from
      })
    }

    if (advancedFilters.dateTo) {
      const to = new Date(advancedFilters.dateTo)
      to.setHours(23, 59, 59, 999) // Incluir todo el día
      filtered = filtered.filter((n) => {
        if (!n.timestamp) return false
        const date = new Date(n.timestamp)
        return date <= to
      })
    }

    return filtered
  }, [validNotifications, activeFilter, searchQuery, advancedFilters])

  // Contar notificaciones por estado
  const counts = useMemo(() => {
    return {
      pending: validNotifications.filter((n) => n.status === "pending").length,
      validated: validNotifications.filter((n) => n.status === "validated").length,
      rejected: validNotifications.filter((n) => n.status === "rejected").length,
    }
  }, [validNotifications])

  const handleStatusChange = async (id: string, newStatus: NotificationStatus) => {
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleAdvancedFilters = (filters: FilterValues) => {
    setAdvancedFilters(filters)
    toast.success("Filtros aplicados", {
      description: "Los filtros se han aplicado correctamente",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NotificationsNavbar
        onFilterChange={setActiveFilter}
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
                      No se encontraron notificaciones con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const isUpdating = updatingIds.has(notification.id)
                    const config = statusConfig[notification.status] || statusConfig.pending
                    const date = notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString("es-ES")
                      : "-"

                    const key = notification.id || `notification-${index}`

                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium truncate">
                          {notification.code || "-"}
                        </TableCell>
                        <TableCell className="truncate">{notification.name}</TableCell>
                        <TableCell className="truncate">{notification.amount || "-"}</TableCell>
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
              </div>
              
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
                
                <div className="text-sm">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
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