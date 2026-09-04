import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DepartmentBars } from '@/components/dashboard/department-bars'
import { DocumentList } from '@/components/dashboard/document-list'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { NewsList } from '@/components/dashboard/news-list'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { ResourceTable } from '@/components/dashboard/resource-table'
import { TurnawayCard } from '@/components/dashboard/turnaway-card'
import { UsageChart } from '@/components/dashboard/usage-chart'
import { requireUser } from '@/lib/auth'
import { documents, news, organisation, resources, totals, turnaways } from '@/lib/data'
import { fmtCompact, fmtNumber, fmtPercent, fmtSekPrecise, greeting } from '@/lib/format'

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      nativeButton={false}
      className="gap-1.5 text-muted-foreground"
      render={<Link href={href} />}
    >
      {label}
      <ArrowRight className="size-4" />
    </Button>
  )
}

export default async function OverviewPage() {
  const user = await requireUser()
  const topResources = [...resources].sort((a, b) => b.requestsYtd - a.requestsYtd).slice(0, 5)
  const topTurnaways = [...turnaways].sort((a, b) => b.denialsYtd - a.denialsYtd).slice(0, 3)

  return (
    <>
      <PageHeader
        eyebrow={`${organisation.fullName} · Avtalsår ${organisation.contractYear}`}
        title={greeting(user.displayName)}
        description={`Här är läget för ${organisation.unit}s e-resurser. Nyttjandet ligger ${fmtPercent(
          totals.requestsGrowth,
          true,
        )} mot samma period förra året och ${totals.renewalsSoon} avtal närmar sig förnyelse.`}
      />

      <KpiStrip
        items={[
          {
            label: 'Fulltextnedladdningar i år',
            value: fmtCompact(totals.requestsYtd),
            delta: { value: fmtPercent(totals.requestsGrowth, true), positive: true },
            hint: 'mot fg. år',
          },
          {
            label: 'Kostnad per nedladdning',
            value: fmtSekPrecise(totals.costPerRequest),
            delta: { value: '−6,1 %', positive: true },
            hint: 'mot fg. år',
          },
          {
            label: 'Aktiva resurser',
            value: String(totals.activeResources),
            hint: `${totals.renewalsSoon} förnyas inom 4 månader`,
          },
          {
            label: 'Nekade åtkomster i år',
            value: fmtNumber(totals.denialsYtd),
            delta: { value: '+27 %', positive: false },
            hint: 'efterfrågan utan tillgång',
            signal: true,
          },
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-5 md:p-6">
          <SectionHeader
            title="Nyttjande över året"
            description="Fulltextnedladdningar per månad, alla plattformar. Streckad linje: nekade åtkomster."
          />
          <UsageChart />
        </div>
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-5 md:p-6">
          <SectionHeader title="Per skola" description="Andel av nedladdningar i år" />
          <DepartmentBars />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Efterfrågan utan tillgång"
          description="Innehåll era forskare och studenter försökt nå men inte har tillgång till."
          action={<ViewAll href="/efterfragan" label="Visa alla" />}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {topTurnaways.map((t, i) => (
            <TurnawayCard key={t.id} item={t} rank={i + 1} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Mest använda resurser"
          description="Kvitto på vad ni redan betalar för."
          action={<ViewAll href="/anvandning" label="Alla resurser" />}
        />
        <ResourceTable rows={topResources} compact />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeader
            title="Från förlagen"
            description="Utvalt för KTH"
            action={<ViewAll href="/nyheter" label="Alla nyheter" />}
          />
          <NewsList items={news.slice(0, 3)} />
        </div>
        <div className="flex flex-col gap-5">
          <SectionHeader
            title="Senaste dokument"
            description="Avtal, rapporter och presentationer"
            action={<ViewAll href="/dokument" label="Öppna valvet" />}
          />
          <DocumentList
            items={[...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)}
          />
        </div>
      </section>
    </>
  )
}
