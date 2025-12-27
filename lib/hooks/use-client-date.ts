"use client"

import { useSyncExternalStore } from "react"

/**
 * Hook que formatea fechas de forma segura para SSR/hidratación
 * Retorna un placeholder en servidor y la fecha formateada en cliente
 */
export function useClientDate(
  timestamp: number,
  placeholder: string = "--/--/----, --:--"
) {
  const isClient = useSyncExternalStore(
    // subscribe: no hace nada porque el estado nunca cambia
    () => () => {},
    // getSnapshot: retorna true en el cliente
    () => true,
    // getServerSnapshot: retorna false durante SSR
    () => false
  )

  if (!isClient) {
    return placeholder
  }

  // Formato compatible con formatDate actual
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year}, ${hours}:${minutes}`
}
