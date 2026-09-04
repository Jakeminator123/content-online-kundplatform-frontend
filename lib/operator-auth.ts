import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isLocalDemo } from './backend-client'
import { OperatorSessions } from './operator-sessions'

// Preserve the local session registry across Next.js development module reloads.
const localState = globalThis as typeof globalThis & { contentOnlineOperatorSessions?: OperatorSessions }
const sessions = localState.contentOnlineOperatorSessions ??= new OperatorSessions()
const COOKIE = 'co_operator_session'

export async function hasOperatorSession() {
  if (!isLocalDemo()) return false
  return sessions.verify((await cookies()).get(COOKIE)?.value)
}

export async function requireOperator() {
  if (!await hasOperatorSession()) redirect('/content-online/login')
}

export async function startOperatorSession() {
  if (!isLocalDemo()) throw new Error('Local operator demo is disabled')
  const token = sessions.create()
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: false, path: '/content-online', maxAge: 8 * 60 * 60,
  })
}

export async function endOperatorSession() {
  const store = await cookies()
  sessions.delete(store.get(COOKIE)?.value)
  store.set(COOKIE, '', { path: '/content-online', maxAge: 0 })
}
