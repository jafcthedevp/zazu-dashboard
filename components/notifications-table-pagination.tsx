"use client"

import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { PaginationInfo } from "@/types/notifications"

interface NotificationsTablePaginationProps {
  pagination: PaginationInfo
  currentResultsCount: number
  onPageChange: (page: number) => void
}

export function NotificationsTablePagination({
  pagination,
  currentResultsCount,
  onPageChange,
}: NotificationsTablePaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Mostrado {currentResultsCount} resultados
          {pagination.hasMore && " (Hay mas contenido disponible)"}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">
              <strong>Como funciona la paginacción:</strong><br />
              • Cada pagina muestra {pagination.pageSize} notificaciones<br />
              • Usar Anterior/Siguiente botones para navegar<br />
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">Página {pagination.page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasMore}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
