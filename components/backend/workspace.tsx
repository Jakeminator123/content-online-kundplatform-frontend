import 'server-only'
import { BackendError, createLocalBackendClient, type BackendActor, type WorkspaceData } from '@/lib/backend-client'
import { TicketForm, type TicketAction } from './ticket-form'

const roleLabels: Record<string, string> = {
  customer_reader: 'Kundläsare', customer_admin: 'Kundadmin', content_operator: 'Content Online-personal',
}
const ticketStatus: Record<string, string> = { open: 'Öppet', in_progress: 'Pågår', closed: 'Stängt' }
const number = new Intl.NumberFormat('sv-SE')

export async function BackendWorkspace({ actor, organizationId, action }: {
  actor: BackendActor; organizationId?: string; action: TicketAction
}) {
  let data: WorkspaceData
  try {
    data = await createLocalBackendClient(actor).workspace(organizationId)
  } catch (error) {
    return <section className="rounded-xl border bg-card p-6" role="alert">
      <h2 className="text-lg font-medium">Kunddata är inte tillgängliga</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error instanceof BackendError ? error.message : 'Kunddata kunde inte läsas. Försök igen.'}</p>
    </section>
  }
  const { overview, portfolio, usage, tickets, members } = data
  const metrics = [
    ['Aktiva resurser', overview.summary.activeProducts],
    ['Statistikposter', overview.summary.usageObservations],
    ['Öppna ärenden', overview.summary.openTickets],
    ['Resurser utan statistik', overview.summary.sourcesWithMissingUsage],
  ] as const

  return <div className="grid gap-7">
    <section className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Ansluten kund</p>
          <h2 className="mt-1 text-xl font-medium">{overview.organization.displayName}</h2></div>
        <span className="rounded-full border px-3 py-1 text-xs">{roleLabels[overview.effectiveRole] ?? overview.effectiveRole}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Syntetiska testdata hämtade från Content Onlines backend. Denna testorganisation är inte KTH:s riktiga konto.</p>
      <dl className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {metrics.map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-mono text-3xl text-foreground">{number.format(value)}</dd></div>)}
      </dl>
    </section>

    <section className="grid gap-3"><h2 className="text-lg font-medium">Resurser och fast pris</h2>
      {portfolio.items.map(item => {
        const cost = usage.costAnalyses?.find(row => row.entitlementId === item.id)?.calculation
        return <article key={item.id} className="rounded-xl border bg-card p-5">
          <p className="text-xs text-muted-foreground">{item.publisherName}</p><h3 className="font-medium">{item.productName}</h3>
          {item.fixedPrice ? <p className="mt-3 text-sm">Fast avtalspris: {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: item.fixedPrice.currency }).format(item.fixedPrice.amountMinor / 100)}</p> : null}
          {cost?.status === 'calculated' ? <p className="mt-1 text-sm">Kostnad per godkänd nedladdning: <strong>{cost.result.amount} {cost.result.currency}</strong> · demoberäkning</p> : null}
          {cost?.status === 'not_calculable' ? <p className="mt-1 text-sm text-muted-foreground">Kostnad per nedladdning kan inte beräknas från det här underlaget.</p> : null}
        </article>
      })}
      {!portfolio.items.length ? <p className="text-sm text-muted-foreground">Inga resurser registrerade.</p> : null}
    </section>

    <section className="grid gap-3"><h2 className="text-lg font-medium">Användning med källhänvisning</h2>
      <p className="text-sm text-muted-foreground">Varje publicists mått visas med egen definition. MPS gäller IEEE; andra publicister kan ha andra verktyg och format.</p>
      {usage.observations.map(row => <article key={row.id} className="rounded-xl border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="font-medium">{row.metric.sourceLabel}</p><p className="mt-1 text-sm text-muted-foreground">{row.publisherId.toUpperCase()} · {row.providerId.toUpperCase()}</p></div>
          <p className="font-mono text-3xl text-foreground">{number.format(row.value)}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Period: {row.period.start} till {row.period.endExclusive} (slutdatum exkluderat). {row.quality.coverage === 'complete' ? 'Komplett underlag.' : 'Ofullständigt eller okänt underlag.'}</p>
        <details className="mt-3 text-xs text-muted-foreground"><summary className="cursor-pointer">Visa källdefinition</summary>
          <p className="mt-2">Källmått: {row.metric.sourceCode} · adapter {row.provenance.adapterVersion} · mappning {row.provenance.mappingVersion} · {row.provenance.mode === 'demo' ? 'syntetisk källa' : 'ansluten källa'}</p>
          {row.quality.warnings.map(warning => <p key={warning}>{warning}</p>)}
        </details>
      </article>)}
      {!usage.observations.length ? <p className="text-sm text-muted-foreground">Statistik saknas. Det betyder inte noll användning.</p> : null}
    </section>

    {members ? <section className="grid gap-3"><h2 className="text-lg font-medium">Kundens användare</h2>
      <ul className="divide-y rounded-xl border bg-card">{members.members.map(member => <li key={member.id} className="flex flex-wrap justify-between gap-2 p-4 text-sm">
        <span>{member.displayName}</span><span className="text-muted-foreground">{roleLabels[member.role] ?? member.role}</span>
      </li>)}</ul><p className="text-xs text-muted-foreground">Behörighetsändringar begärs som ärenden.</p>
    </section> : null}

    <section className="grid gap-3"><h2 className="text-lg font-medium">Ärenden</h2>
      {!tickets.tickets.length ? <p className="text-sm text-muted-foreground">Inga ärenden ännu.</p> : null}
      {tickets.tickets.map(ticket => <article key={ticket.id} className="rounded-xl border bg-card p-4">
        <div className="flex justify-between gap-4"><h3 className="font-medium">{ticket.title}</h3><span className="text-xs text-muted-foreground">{ticketStatus[ticket.status] ?? ticket.status}</span></div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{ticket.description}</p><p className="mt-2 font-mono text-xs text-muted-foreground">{ticket.id}</p>
      </article>)}
    </section>
    <TicketForm organizationId={overview.organization.id} action={action} />
  </div>
}
