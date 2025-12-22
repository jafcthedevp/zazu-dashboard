"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      <p className="text-sm text-muted-foreground">
        Mostrando {currentResultsCount} resultados
        {pagination.hasMore && " (hay más disponibles)"}
      </p>
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
