// components/notifications-navbar.tsx
'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type FilterStatus = 'all' | 'pending' | 'validated' | 'rejected';

interface NotificationsNavbarProps {
  onFilterChange: (status: FilterStatus) => void;
  activeFilter: FilterStatus;
  counts: {
    pending: number;
    validated: number;
    rejected: number;
  };
  onLogout: () => void;
}

export function NotificationsNavbar({
  onFilterChange,
  activeFilter,
  counts,
  onLogout,
}: NotificationsNavbarProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold">Notificaciones</h2>
            
            <nav className="flex items-center gap-1">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('all')}
              >
                Todas
              </Button>
              
              <Button
                variant={activeFilter === 'pending' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('pending')}
                className="gap-2"
              >
                Pendientes
                {counts.pending > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {counts.pending}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={activeFilter === 'validated' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('validated')}
                className="gap-2"
              >
                Validadas
                {counts.validated > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {counts.validated}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={activeFilter === 'rejected' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('rejected')}
                className="gap-2"
              >
                Rechazadas
                {counts.rejected > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {counts.rejected}
                  </Badge>
                )}
              </Button>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}