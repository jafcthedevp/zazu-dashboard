"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface FilterValues {
  code?: string
  deviceId?: string
  name?: string
  amountMin?: string
  amountMax?: string
  dateFrom?: string
  dateTo?: string
}

interface NotificationsFiltersProps {
  onApplyFilters: (filters: FilterValues) => void
  activeFilters: FilterValues
}

export function NotificationsFilters({ onApplyFilters, activeFilters }: NotificationsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>(activeFilters)

  const hasActiveFilters = Object.values(activeFilters).some((v) => v && v !== "")

  const handleApply = () => {
    onApplyFilters(filters)
    setIsOpen(false)
  }

  const handleClear = () => {
    const emptyFilters: FilterValues = {}
    setFilters(emptyFilters)
    onApplyFilters(emptyFilters)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant={hasActiveFilters ? "default" : "outline"} size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary-foreground px-1.5 text-xs text-primary">
                {Object.values(activeFilters).filter((v) => v && v !== "").length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros Avanzados</h4>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                placeholder="Buscar por código..."
                value={filters.code || ""}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deviceId">ID de Dispositivo</Label>
              <Input
                id="deviceId"
                placeholder="Ej: P5-A, P6-B..."
                value={filters.deviceId || ""}
                onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Buscar por nombre..."
                value={filters.name || ""}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div> */}

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="amountMin">Monto mínimo</Label>
                <Input
                  id="amountMin"
                  type="number"
                  placeholder="0"
                  value={filters.amountMin || ""}
                  onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amountMax">Monto máximo</Label>
                <Input
                  id="amountMax"
                  type="number"
                  placeholder="10000"
                  value={filters.amountMax || ""}
                  onChange={(e) => setFilters({ ...filters, amountMax: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="dateFrom">Desde</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateTo">Hasta</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleApply} className="w-full">
              Aplicar Filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
