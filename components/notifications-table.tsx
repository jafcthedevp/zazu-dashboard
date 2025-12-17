"use client"

import { useState, useMemo } from "react"
import type { Notification, NotificationStatus } from "@/types/notifications"
import { updateNotificationStatus } from "@/app/dashboard/action"
import { NotificationsNavbar } from "@/components/notifications-navbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface NotificationsTableProps {
  initialNotifications: Notification[]
  onLogout: () => void
}

type FilterStatus = "all" | "pending" | "validated" | "rejected"

const statusConfig: Record<NotificationStatus, { label: string; variant: "secondary" | "default" | "destructive" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  validated: { label: "Validada", variant: "default" },
  rejected: { label: "Rechazada", variant: "destructive" },
}

export function NotificationsTable({ initialNotifications, onLogout }: NotificationsTableProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(initialNotifications) ? initialNotifications : [],
  )
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar notificaciones válidas (que tengan id)
  const validNotifications = useMemo(() => {
    return notifications.filter((n) => n && n.id)
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    let filtered = validNotifications

    // Filtrar por estado
    if (activeFilter !== "all") {
      filtered = filtered.filter((n) => n.status === activeFilter)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((n) => {
        const code = (n.code || "").toLowerCase()
        const device = (n.device_id || "").toLowerCase()
        const amount = (n.amount || "")

        return code.includes(query) || device.includes(query)
      })
    }

    return filtered
  }, [validNotifications, activeFilter, searchQuery])

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
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, status: newStatus } : notif)))
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NotificationsNavbar
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        counts={counts}
        onLogout={onLogout}
        // Pasadas props de búsqueda al navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
                      {activeFilter === "all"
                        ? "No hay notificaciones"
                        : `No hay notificaciones ${activeFilter === "pending" ? "pendientes" : activeFilter === "validated" ? "validadas" : "rechazadas"}`}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const isUpdating = updatingIds.has(notification.id)
                    const config = statusConfig[notification.status] || statusConfig.pending
                    const date = notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString("es-ES")
                      : notification.timestamp
                        ? new Date(notification.timestamp).toLocaleDateString("es-ES")
                        : "-"

                    // Usar id o index como fallback para la key
                    const key = notification.id || `notification-${index}`

                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium truncate">{notification.code || "-"}</TableCell>
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
                            onValueChange={(value) => handleStatusChange(notification.id, value as NotificationStatus)}
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-[130px] ml-auto">
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue />}
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
          </div>
        </div>
      </div>
    </div>
  )
}
