'use client';

import { useState, useMemo } from 'react';
import { Notification, NotificationStatus } from '@/types/notifications';
import { updateNotificationStatus } from '@/app/dashboard/action';
import { NotificationsNavbar } from '@/components/notifications-navbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface NotificationsTableProps {
  initialNotifications: Notification[];
  onLogout: () => void;
}

type FilterStatus = 'all' | 'pending' | 'validated' | 'rejected';

const statusConfig: Record<NotificationStatus, { label: string; variant: 'secondary' | 'default' | 'destructive' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  validated: { label: 'Validada', variant: 'default' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
};

export function NotificationsTable({ initialNotifications, onLogout }: NotificationsTableProps) {

  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(initialNotifications) ? initialNotifications : []
  );
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Filtrar notificaciones válidas (que tengan id)
  const validNotifications = useMemo(() => {
    return notifications.filter(n => n && n.id);
  }, [notifications]);

  // Filtrar por estado
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return validNotifications;
    return validNotifications.filter((n) => n.status === activeFilter);
  }, [validNotifications, activeFilter]);

  // Contar notificaciones por estado
  const counts = useMemo(() => {
    return {
      pending: validNotifications.filter((n) => n.status === 'pending').length,
      validated: validNotifications.filter((n) => n.status === 'validated').length,
      rejected: validNotifications.filter((n) => n.status === 'rejected').length,
    };
  }, [validNotifications]);

  const handleStatusChange = async (id: string, newStatus: NotificationStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      const result = await updateNotificationStatus(id, newStatus);

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: newStatus } : notif
          )
        );
        toast.success('Estado actualizado', {
          description: `La notificación ha sido ${statusConfig[newStatus].label.toLowerCase()}.`,
        });
      } else {
        toast.error('Error al actualizar', {
          description: result.error || 'No se pudo actualizar el estado',
        });
      }
    } catch (error) {
      toast.error('Error inesperado', {
        description: 'Ocurrió un error al procesar la solicitud',
      });
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <NotificationsNavbar
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        counts={counts}
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6">
          <div className="rounded-md border">
            <Table className="border">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      {activeFilter === 'all' 
                        ? 'No hay notificaciones' 
                        : `No hay notificaciones ${activeFilter === 'pending' ? 'pendientes' : activeFilter === 'validated' ? 'validadas' : 'rechazadas'}`
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const isUpdating = updatingIds.has(notification.id);
                    const config = statusConfig[notification.status] || statusConfig.pending;
                    const date = notification.timestamp 
                      ? new Date(notification.timestamp).toLocaleString('es-ES')
                      : notification.timestamp
                        ? new Date(notification.timestamp).toLocaleDateString('es-ES')
                        : '-';

                    // Usar id o index como fallback para la key
                    const key = notification.id || `notification-${index}`;

                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{notification.code || '-'}</TableCell>
                        <TableCell>{notification.name}</TableCell>
                        <TableCell>{notification.amount || '-'}</TableCell>
                        <TableCell>{notification.device_id || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={notification.status}
                            onValueChange={(value) =>
                              handleStatusChange(notification.id, value as NotificationStatus)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-[140px]">
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}