'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface FilterValues {
  code?: string;
  deviceId?: string;
  amountMin?: string;
  amountMax?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

interface NotificationsFiltersProps {
  onApplyFilters: (filters: FilterValues) => void;
  activeFilters: FilterValues;
}

export function NotificationsFilters({
  onApplyFilters,
  activeFilters,
}: NotificationsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(activeFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {};
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Contar filtros activos
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros avanzados</SheetTitle>
          <SheetDescription>
            Filtra las notificaciones por diferentes criterios
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Filtro por código */}
          <div className="space-y-2">
            <Label htmlFor="code">Código de voucher</Label>
            <Input
              id="code"
              placeholder="Ej: ABC123"
              value={filters.code || ''}
              onChange={(e) => handleChange('code', e.target.value)}
            />
          </div>

          {/* Filtro por dispositivo */}
          <div className="space-y-2">
            <Label htmlFor="deviceId">ID de dispositivo</Label>
            <Input
              id="deviceId"
              placeholder="Ej: DEVICE-001"
              value={filters.deviceId || ''}
              onChange={(e) => handleChange('deviceId', e.target.value)}
            />
          </div>

          {/* Filtro por estado */}
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                handleChange('status', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="validated">Validada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por monto */}
          <div className="space-y-2">
            <Label>Rango de monto</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.amountMin || ''}
                  onChange={(e) => handleChange('amountMin', e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.amountMax || ''}
                  onChange={(e) => handleChange('amountMax', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filtro por fecha */}
          <div className="space-y-2">
            <Label>Rango de fechas</Label>
            <div className="grid gap-2">
              <div>
                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                  Desde
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                  Hasta
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleChange('dateTo', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}