import Link from 'next/link'
import { requireOperator } from '@/lib/operator-auth'
import { BackendWorkspace } from '@/components/backend/workspace'
import { createOperatorTicket, operatorLogout } from './actions'

export default async function OperatorPage({ searchParams }: { searchParams: Promise<{ organization?: string }> }) {
  await requireOperator()
  const { organization } = await searchParams
  return <main className="min-h-svh bg-background">
    <header className="bg-sidebar px-6 py-5 text-sidebar-primary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div><p className="text-lg font-medium">Content Online</p><p className="text-xs text-sidebar-foreground">Personalportal · lokal demo</p></div>
        <div className="flex items-center gap-5 text-sm"><Link href="/login">Kundportalen</Link><form action={operatorLogout}><button className="rounded-md border border-sidebar-border px-3 py-2">Logga ut personal</button></form></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-6xl gap-7 px-6 py-10">
      <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Dina kunder</p><h1 className="mt-2 text-3xl font-medium tracking-tight">Kundöversikt</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Du ser endast kunder som backend har tilldelat ditt personalkonto. Ärenden och användare hör till vald kund.</p>
      </div>
      <BackendWorkspace actor="operator" organizationId={organization} action={createOperatorTicket} />
    </div>
  </main>
}
