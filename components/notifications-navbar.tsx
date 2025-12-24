"use client"

import { LogOut, Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NotificationsFilters, type FilterValues } from "@/components/notifications-filters"

type FilterStatus = "all" | "pending" | "validated" | "rejected"

interface NotificationsNavbarProps {
  onFilterChange: (status: FilterStatus) => void
  activeFilter: FilterStatus
  counts: {
    pending: number
    validated: number
    rejected: number
  }
  onLogout: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onAdvancedFilters: (filters: FilterValues) => void
  advancedFilters: FilterValues
}

export function NotificationsNavbar({
  onFilterChange,
  activeFilter,
  counts,
  onLogout,
  searchQuery,
  onSearchChange,
  onAdvancedFilters,
  advancedFilters,
}: NotificationsNavbarProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Notificaciones</h1>
          </div>

          <nav className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => onFilterChange("all")}
              >
                Todas
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">
                    Muestra todas las notificaciones paginadas. El conteo exacto no está disponible debido a la arquitectura de DynamoDB.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Button
              variant={activeFilter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("pending")}
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
              variant={activeFilter === "validated" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("validated")}
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
              variant={activeFilter === "rejected" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("rejected")}
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

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por código, dispositivo o monto..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <NotificationsFilters onApplyFilters={onAdvancedFilters} activeFilters={advancedFilters} />
        </div>
      </div>
    </div>
  )
}
