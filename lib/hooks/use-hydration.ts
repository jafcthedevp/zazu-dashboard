"use client"

import { useSyncExternalStore } from "react"

/**
 * Hook que detecta si el componente está hidratado (cliente)
 * sin violar react-hooks/set-state-in-effect
 *
 * Usa useSyncExternalStore de React 18+ que es la API oficial
 * para suscribirse a stores externos (en este caso, el estado de hidratación)
 */
export function useHydration() {
  return useSyncExternalStore(
    // subscribe: función que se llama cuando el componente se monta
    // No necesita hacer nada porque el estado de hidratación nunca cambia después del montaje
    () => () => {},

    // getSnapshot: retorna el valor actual (cliente)
    () => true,

    // getServerSnapshot: retorna el valor durante SSR (servidor)
    () => false
  )
}
