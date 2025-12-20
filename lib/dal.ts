import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Data Access Layer (DAL) para Next.js 15/16
 *
 * Este archivo centraliza todas las verificaciones de autenticación
 * y acceso a datos del usuario. Usa React cache() para optimizar
 * múltiples llamadas durante el rendering.
 *
 */

/**
 * Verificar la sesión del usuario
 * Usa cache() para que múltiples componentes puedan llamarlo sin overhead
 */
export const verifySession = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return { user }
})

export const getOptionalUser = cache(async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
})

