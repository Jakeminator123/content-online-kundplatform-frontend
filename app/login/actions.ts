'use server'

import { redirect } from 'next/navigation'
import { authenticate, createSession, destroySession } from '@/lib/auth'

export type LoginState = { error?: string } | undefined

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/')

  if (!username || !password) {
    return { error: 'Fyll i både användarnamn och lösenord.' }
  }

  const user = authenticate(username, password)
  if (!user) {
    return { error: 'Fel användarnamn eller lösenord.' }
  }

  await createSession(user)
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/')
}

export async function logoutAction() {
  await destroySession()
  redirect('/login')
}
