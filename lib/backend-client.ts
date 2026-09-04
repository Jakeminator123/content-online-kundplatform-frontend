import 'server-only'

export type BackendActor = 'operator' | 'admin' | 'staff'
type Environment = { NODE_ENV?: string; VERCEL?: string }

export function isLocalDemo(environment: Environment = process.env) {
  return environment.NODE_ENV === 'development' && !environment.VERCEL
}

export class BackendError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'BackendError'
  }
}

export type PortalIdentity = {
  user: { id: string; displayName: string; accountType: 'customer' | 'content_operator' }
  memberships: { organizationId: string; role: 'customer_reader' | 'customer_admin' }[]
  operatorScopes: { organizationId: string }[]
}
export type Overview = {
  organization: { id: string; displayName: string }
  effectiveRole: string
  summary: { activeProducts: number; usageObservations: number; openTickets: number; sourcesWithMissingUsage: number }
}
export type Portfolio = {
  items: { id: string; publisherName: string; productName: string; accessStatus: string;
    fixedPrice?: { amountMinor: number; currency: string } }[]
}
export type Usage = {
  observations: { id: string; value: number; publisherId: string; providerId: string;
    period: { start: string; endExclusive: string };
    metric: { sourceLabel: string; sourceCode: string; semanticStatus: string };
    provenance: { mode: string; adapterVersion: string; mappingVersion: string };
    quality: { coverage: string; warnings: string[] } }[]
  costAnalyses?: { entitlementId: string; calculation:
    | { status: 'calculated'; result: { amount: string; currency: string } }
    | { status: 'not_calculable'; reason: string } }[]
}
export type Tickets = {
  tickets: { id: string; title: string; description: string; status: string; createdAt: string }[]
}
export type Members = { members: { id: string; displayName: string; role: string; email: string }[] }
export type TicketInput = {
  category: 'access' | 'usage_data' | 'membership_change' | 'other'
  title: string
  description: string
}
export type WorkspaceData = {
  overview: Overview; portfolio: Portfolio; usage: Usage; tickets: Tickets; members: Members | null
}

// Only constructed on the server after the portal's own session check.
// Demo credentials have a fixed loopback destination and can never be sent to Vercel.
export function createLocalBackendClient(
  actor: BackendActor,
  environment: Environment = process.env,
  transport: typeof fetch = fetch,
) {
  if (!isLocalDemo(environment)) throw new BackendError(503, 'Kopplingen till kunddata väntar på produktionsinloggning. Prova den lokala demon under tiden.')
  const token = { operator: 'demo-operator', admin: 'demo-admin-a', staff: 'demo-reader-a' }[actor]
  if (!token) throw new BackendError(403, 'Kontot saknar behörighet.')

  async function request<T>(path: string, input?: TicketInput): Promise<T> {
    let response: Response
    try {
      response = await transport(`http://127.0.0.1:3000${path}`, {
        method: input ? 'POST' : 'GET',
        headers: { authorization: `Bearer ${token}`, ...(input ? { 'content-type': 'application/json' } : {}) },
        ...(input ? { body: JSON.stringify(input) } : {}),
        cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000),
      })
    } catch {
      throw new BackendError(503, 'Kunddata går inte att hämta just nu. Kontrollera att den lokala backendservern körs på port 3000.')
    }
    if (!response.ok) {
      const messages: Record<number, string> = {
        401: 'Inloggningen behöver förnyas.', 403: 'Kontot saknar behörighet.',
        404: 'Kunden finns inte eller ingår inte i din åtkomst.',
        422: 'Kontrollera ärendets kategori, rubrik och beskrivning.',
        503: 'Produktionsinloggningen är ännu inte ansluten.',
      }
      throw new BackendError(response.status, messages[response.status] ?? 'Kunddata kunde inte läsas. Försök igen.')
    }
    return response.json() as Promise<T>
  }

  async function authorizedOrganization(organizationId?: string) {
    const identity = await request<PortalIdentity>('/v1/me')
    if ((actor === 'operator') !== (identity.user.accountType === 'content_operator')) {
      throw new BackendError(403, 'Kontotypen stämmer inte med portalen.')
    }
    const scopes = actor === 'operator' ? identity.operatorScopes : identity.memberships
    const selected = organizationId ?? scopes[0]?.organizationId
    if (!selected || !scopes.some(scope => scope.organizationId === selected)) {
      throw new BackendError(404, 'Kunden finns inte eller ingår inte i din åtkomst.')
    }
    return `/v1/organizations/${encodeURIComponent(selected)}`
  }

  return {
    async workspace(organizationId?: string): Promise<WorkspaceData> {
      const base = await authorizedOrganization(organizationId)
      const [overview, portfolio, usage, tickets, members] = await Promise.all([
        request<Overview>(`${base}/overview`), request<Portfolio>(`${base}/portfolio`),
        request<Usage>(`${base}/usage`), request<Tickets>(`${base}/tickets`),
        actor === 'staff' ? Promise.resolve(null) : request<Members>(`${base}/members`),
      ])
      return { overview, portfolio, usage, tickets, members }
    },
    async createTicket(organizationId: string, input: TicketInput) {
      const base = await authorizedOrganization(organizationId)
      return request<{ ticket: Tickets['tickets'][number] }>(`${base}/tickets`, input)
    },
  }
}

export function parseTicketInput(form: FormData): TicketInput | null {
  const category = String(form.get('category') ?? '')
  const title = String(form.get('title') ?? '').trim()
  const description = String(form.get('description') ?? '').trim()
  if (!['access', 'usage_data', 'membership_change', 'other'].includes(category)) return null
  if (title.length < 3 || title.length > 120 || description.length < 3 || description.length > 2000) return null
  return { category: category as TicketInput['category'], title, description }
}
