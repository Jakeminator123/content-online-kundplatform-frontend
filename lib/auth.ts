import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { timingSafeEqual } from 'node:crypto'
import { SESSION_COOKIE, signSession, verifySession, type Role } from './session-token'

export type User = {
  username: string
  displayName: string
  role: Role
  title: string
  department: string
  initials: string
}

const USERS: Array<User & { password: string }> = [
  {
    username: 'bibbi',
    displayName: 'Bibbi',
    password: 'Mallorca123',
    role: 'staff',
    title: 'Bibliotekarie, förvärv',
    department: 'KTH Biblioteket',
    initials: 'BI',
  },
  {
    username: 'hampus',
    displayName: 'Hampus',
    password: 'Mallorca123',
    role: 'admin',
    title: 'Avdelningschef, medier & förvärv',
    department: 'KTH Biblioteket',
    initials: 'HA',
  },
]

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function authenticate(username: string, password: string): User | null {
  const record = USERS.find((u) => u.username === username.trim().toLowerCase())
  if (!record || !safeEqual(record.password, password)) return null
  const { password: _pw, ...user } = record
  return user
}

export function getUserByUsername(username: string): User | null {
  const record = USERS.find((u) => u.username === username)
  if (!record) return null
  const { password: _pw, ...user } = record
  return user
}

export function listUsers(): User[] {
  return USERS.map(({ password: _pw, ...user }) => user)
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 8

export async function createSession(user: User) {
  const token = await signSession({
    username: user.username,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  })
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // The v0 preview renders the app inside a cross-origin iframe; a Lax cookie is dropped there.
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies()
  const payload = await verifySession(store.get(SESSION_COOKIE)?.value)
  if (!payload) return null
  return getUserByUsername(payload.username)
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser()
  if (user.role !== 'admin') redirect('/')
  return user
}
