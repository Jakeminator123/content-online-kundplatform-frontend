import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { TurnawayCard } from '@/components/dashboard/turnaway-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { totals, turnaways } from '@/lib/data'
import { fmtNumber, fmtPercent, fmtSek, fmtSekPrecise } from '@/lib/format'

export default function DemandPage() {
  const sorted = [...turnaways].sort((a, b) => b.denialsYtd - a.denialsYtd)
  const users = turnaways.reduce((s, t) => s + t.uniqueUsers, 0)
  const cost = turnaways.reduce((s, t) => s + t.estimatedCost, 0)

  return (
    <>
      <PageHeader
        eyebrow="Efterfrågan utan tillgång"
        title="Det era användare letar efter men inte når"
        description="Utforska syntetiska exempel på efterfrågan utanför KTH:s tilldelade produkter. Ingen verklig användning eller nekad åtkomst hämtas i denna demo."
      />

      <KpiStrip
        items={[
          {
            label: 'Nekade åtkomster i år',
            value: fmtNumber(totals.denialsYtd),
            delta: { value: '+27 %', positive: false },
            hint: 'mot fg. år',
            signal: true,
          },
          { label: 'Berörda användare', value: fmtNumber(users), hint: 'summerat per titel, demo' },
          {
            label: 'Uppskattad kostnad att täcka',
            value: fmtSek(cost),
            hint: 'påhittat prisexempel',
          },
          {
            label: 'Kostnad per nekad',
            value: fmtSekPrecise(cost / totals.denialsYtd),
            hint: `jämför ${fmtSekPrecise(totals.costPerRequest)} per nedladdning idag`,
          },
        ]}
      />

      <section className="flex flex-col gap-5">
        <SectionHeader title="Prioriterade luckor" description="Rankat efter antal nekade åtkomster" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((t, i) => (
            <TurnawayCard key={t.id} item={t} rank={i + 1} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader title="Detaljer" description="Orsak och fördelning per titel" />
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Titel</TableHead>
                <TableHead>Orsak</TableHead>
                <TableHead>Skola</TableHead>
                <TableHead className="text-right">Nekade</TableHead>
                <TableHead className="text-right">Trend</TableHead>
                <TableHead className="pr-5 text-right">Uppskattat pris</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="pl-5">
                    <div className="flex flex-col">
                      <span className="font-medium">{t.title}</span>
                      <span className="text-xs text-muted-foreground">{t.publisher}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.reason}</TableCell>
                  <TableCell className="font-mono text-xs">{t.topDepartment}</TableCell>
                  <TableCell className="tnum text-right font-mono text-signal-foreground">
                    {fmtNumber(t.denialsYtd)}
                  </TableCell>
                  <TableCell className="tnum text-right font-mono">{fmtPercent(t.trend, true)}</TableCell>
                  <TableCell className="tnum pr-5 text-right font-mono">{fmtSek(t.estimatedCost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  )
}
