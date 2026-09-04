import { test } from 'node:test'
import assert from 'node:assert/strict'
import { signSession, verifySession } from '../lib/session-token.ts'
import { OperatorSessions } from '../lib/operator-sessions.ts'
import { BackendError, createLocalBackendClient, isLocalDemo, parseTicketInput } from '../lib/backend-client.ts'

const development = { NODE_ENV: 'development' }
const identity = {
  user: { id: 'operator', accountType: 'content_operator' },
  memberships: [], operatorScopes: [{ organizationId: 'org-a' }],
}

test('customer tokens require valid identity, role, expiration and exact framing', async () => {
  const payload = { username: 'hampus', role: 'admin', exp: Date.now() + 60_000 }
  const valid = await signSession(payload)
  assert.deepEqual(await verifySession(valid), payload)
  assert.equal(await verifySession(valid + '.extra'), null)
  assert.equal(await verifySession('not-a-token'), null)
  assert.equal(await verifySession(await signSession({ ...payload, exp: 0 })), null)
  assert.equal(await verifySession(await signSession({ username: 'hampus', role: 'admin' })), null)
  assert.equal(await verifySession(await signSession({ ...payload, exp: 'never' })), null)
  assert.equal(await verifySession(await signSession({ ...payload, role: 'operator' })), null)
  const alteredBody = Buffer.from(JSON.stringify({ ...payload, username: 'bibbi' })).toString('base64url')
  assert.equal(await verifySession(`${alteredBody}.${valid.split('.')[1]}`), null)
})

test('staff sessions are opaque, expire, revoke and reject customer cookies', async () => {
  let now = 1000
  const sessions = new OperatorSessions(() => now)
  const token = sessions.create()
  assert.equal(sessions.verify(token), true)
  const customer = await signSession({ username: 'hampus', role: 'admin', exp: Date.now() + 60_000 })
  assert.equal(sessions.verify(customer), false)
  assert.equal(sessions.verify(crypto.randomUUID()), false)
  sessions.delete(token)
  assert.equal(sessions.verify(token), false)
  const expiring = sessions.create()
  now += 8 * 60 * 60 * 1000
  assert.equal(sessions.verify(expiring), false)
})

test('demo API credentials cannot run in production, previews or unspecified environments', () => {
  for (const environment of [{}, { NODE_ENV: 'production' }, { NODE_ENV: 'test' }, { NODE_ENV: 'development', VERCEL: '1' }]) {
    assert.equal(isLocalDemo(environment), false)
    assert.throws(() => createLocalBackendClient('operator', environment), error => error instanceof BackendError && error.status === 503)
  }
  assert.equal(isLocalDemo(development), true)
})

test('foreign tenant reads and writes stop before any organization endpoint is contacted', async () => {
  const calls = []
  const client = createLocalBackendClient('operator', development, async url => {
    calls.push(url)
    return Response.json(identity)
  })
  await assert.rejects(client.workspace('org-b'), error => error.status === 404)
  await assert.rejects(client.createTicket('org-b', { category: 'other', title: 'Test', description: 'Test ticket' }), error => error.status === 404)
  assert.deepEqual(calls, ['http://127.0.0.1:3000/v1/me', 'http://127.0.0.1:3000/v1/me'])
})

test('operator access requires the backend to confirm the operator account type', async () => {
  const client = createLocalBackendClient('operator', development, async () => Response.json({ ...identity, user: { id: 'customer', accountType: 'customer' } }))
  await assert.rejects(client.workspace(), error => error.status === 403)
})

test('reader requests use the reader identity and do not fetch the member directory', async () => {
  const paths = []
  const client = createLocalBackendClient('staff', development, async (url, options) => {
    paths.push(url)
    assert.equal(options.headers.authorization, 'Bearer demo-reader-a')
    assert.equal(options.cache, 'no-store')
    assert.equal(options.redirect, 'error')
    return Response.json(url.endsWith('/me') ? {
      user: { id: 'reader', accountType: 'customer' }, memberships: [{ organizationId: 'org-a', role: 'customer_reader' }], operatorScopes: [],
    } : {})
  })
  const workspace = await client.workspace()
  assert.equal(workspace.members, null)
  assert.equal(paths.some(path => path.endsWith('/members')), false)
})

test('backend failures never become fabricated empty successful data', async () => {
  const offline = createLocalBackendClient('operator', development, async () => { throw new Error('offline') })
  await assert.rejects(offline.workspace(), error => error.status === 503)
  const denied = createLocalBackendClient('operator', development, async () => new Response('denied', { status: 403 }))
  await assert.rejects(denied.workspace(), error => error.status === 403)
})

test('ticket input rejects invalid categories and out-of-range text', () => {
  const form = new FormData()
  form.set('category', 'usage_data'); form.set('title', '  Statistikfråga  '); form.set('description', 'Kontrollera perioden')
  assert.equal(parseTicketInput(form)?.title, 'Statistikfråga')
  form.set('category', 'admin_override'); assert.equal(parseTicketInput(form), null)
  form.set('category', 'other'); form.set('title', 'x'.repeat(121)); assert.equal(parseTicketInput(form), null)
  form.set('title', 'ok'); assert.equal(parseTicketInput(form), null)
})
