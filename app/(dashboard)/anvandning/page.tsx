import { DepartmentBars } from '@/components/dashboard/department-bars'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { ResourceExplorer } from '@/components/dashboard/resource-explorer'
import { requireUser } from '@/lib/auth'
import { UsageChart } from '@/components/dashboard/usage-chart'
import { monthlyUsage, resources, totals } from '@/lib/data'
import { fmtCompact, fmtNumber, fmtPercent, fmtSek, fmtSekPrecise } from '@/lib/format'

export default async function UsagePage() {
  const user = await requireUser()
  const commercial = user.role === 'admin'
  const searches = monthlyUsage.reduce((s, m) => s + m.searches, 0)
  const uniqueUsers = resources.reduce((s, r) => s + r.uniqueUsersYtd, 0)
  const sorted = [...resources].sort((a, b) => b.requestsYtd - a.requestsYtd)
  const best = [...resources].sort(
    (a, b) => a.annualCost / a.requestsYtd - b.annualCost / b.requestsYtd,
  )[0]
  const weakest = [...resources].sort(
    (a, b) => b.annualCost / b.requestsYtd - a.annualCost / a.requestsYtd,
  )[0]

  return (
    <>
      <PageHeader
        eyebrow="Nyttjande · syntetisk demo"
        title="Mer insikt i era resurser."
        description="Exempel på hur KTH:s tilldelade produkter kan följas. Siffrorna är syntetiska och ingen automatisk COUNTER-, SUSHI- eller publicistimport är ansluten."
      />

      <KpiStrip
        items={[
          {
            label: 'Användning · demo',
            value: fmtCompact(totals.requestsYtd),
            delta: { value: fmtPercent(totals.requestsGrowth, true), positive: true },
            hint: 'mot fg. år',
          },
          { label: 'Sökningar', value: fmtCompact(searches), hint: 'syntetiska sökningar' },
          { label: 'Användare per plattform', value: fmtNumber(uniqueUsers), hint: 'summerat per plattform' },
          ...(commercial ? [{
            label: 'Total årsbudget, demo',
            value: fmtSek(totals.annualCost),
            hint: 'ej periodiserad kostnad',
          }] : []),
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-5 md:p-6">
          <SectionHeader title="Månad för månad" description="Fulltextnedladdningar och nekade åtkomster" />
          <UsageChart />
        </div>
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-5 md:p-6">
          <SectionHeader title="Per skola" description="Fördelning av nedladdningar" />
          <DepartmentBars />
        </div>
      </section>

      {commercial ? <section className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Bäst värde</p>
          <p className="font-medium">{best.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {fmtSekPrecise(best.annualCost / best.requestsYtd)} per nedladdning och{' '}
            {fmtPercent(((best.requestsYtd - best.requestsPrevYtd) / best.requestsPrevYtd) * 100, true)}{' '}
            i tillväxt. Syntetiskt exempel för en budgetdialog.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Värt att se över
          </p>
          <p className="font-medium">{weakest.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {fmtSekPrecise(weakest.annualCost / weakest.requestsYtd)} per nedladdning. Jämförelsen använder syntetisk årsbudget delad med användning under januari–augusti.
          </p>
        </div>
      </section> : null}

      <section className="flex flex-col gap-5">
        <SectionHeader title="Alla resurser" description={`${resources.length} produkter i demoportföljen`} />
        <ResourceExplorer rows={sorted} showCommercial={commercial} />
      </section>
    </>
  )
}
