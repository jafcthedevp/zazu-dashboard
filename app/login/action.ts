'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginState = {
  error?: string
  success?: boolean
}

/**
 * Server Action para iniciar sesión
 */
export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Validar datos del formulario
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  // Intentar iniciar sesión
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
    }
  }

  redirect('/dashboard')
}

/**
 * Server Action para cerrar sesión
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}