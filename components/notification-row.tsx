"use client"

import type React from "react"
import { Check, X, Clock, MoreHorizontal } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Notification, NotificationStatus } from "@/types/notifications"
import { formatDate, formatAmount } from "@/lib/utils"

interface NotificationRowProps {
  notification: Notification
  isUpdating: boolean
  onStatusUpdate: (id: string, status: NotificationStatus) => void
}

const statusConfig: Record<
  NotificationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
> = {
  pending: { label: "Pendiente", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  validated: { label: "Validada", variant: "default", icon: <Check className="h-3 w-3" /> },
  rejected: { label: "Rechazada", variant: "destructive", icon: <X className="h-3 w-3" /> },
}

export function NotificationRow({ notification, isUpdating, onStatusUpdate }: NotificationRowProps) {
  const config = statusConfig[notification.status]

  return (
    <TableRow>
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
              disabled={isUpdating}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {notification.status !== "validated" && (
              <DropdownMenuItem onClick={() => onStatusUpdate(notification.id, "validated")}>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Validar
              </DropdownMenuItem>
            )}
            {notification.status !== "rejected" && (
              <DropdownMenuItem onClick={() => onStatusUpdate(notification.id, "rejected")}>
                <X className="mr-2 h-4 w-4 text-red-500" />
                Rechazar
              </DropdownMenuItem>
            )}
            {notification.status !== "pending" && (
              <DropdownMenuItem onClick={() => onStatusUpdate(notification.id, "pending")}>
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                Marcar pendiente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
