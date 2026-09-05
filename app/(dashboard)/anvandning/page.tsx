import { CalendarDays } from 'lucide-react'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { ResourceExplorer } from '@/components/dashboard/resource-explorer'
import { StatisticsExplorer } from '@/components/dashboard/statistics-explorer'
import { StatisticsFocus } from '@/components/dashboard/statistics-focus'
import { requireUser } from '@/lib/auth'
import { resources, totals } from '@/lib/data'
import { fmtCompact, fmtPercent } from '@/lib/format'
import { getStatisticsData } from '@/lib/statistics'

export default async function UsagePage({ searchParams }: { searchParams: Promise<{ vy?: string | string[] }> }) {
  const user = await requireUser()
  const commercial = user.role === 'admin'
  const params = await searchParams
  const selected = typeof params.vy === 'string' ? params.vy : undefined
  const data = getStatisticsData(commercial)
  const declining = resources.filter(r => r.requestsYtd < r.requestsPrevYtd).length
  const visibleResources = resources.map(r => ({ ...r, annualCost: commercial ? r.annualCost : 0 }))
  return <>
    <PageHeader eyebrow="KTH / ANVÄNDNING & INSIKTER" title="Förstå värdet av er kunskap." description="Se vad som används, vad som förändras och vad som behöver följas upp. Flera perspektiv på samma demoportfölj." action={<span className="statistics-period flex items-center gap-2"><CalendarDays size={14} />Januari–augusti 2026</span>} />
    <KpiStrip items={[
      { label: 'Användning i perioden', value: fmtCompact(totals.requestsYtd), hint: 'syntetiskt produktmått' },
      { label: 'Jämfört med föregående år', value: fmtPercent(totals.requestsGrowth, true), hint: 'samma period · demo' },
      { label: 'Publicister i portföljen', value: String(new Set(resources.map(r => r.publisher)).size), hint: `${resources.length} tilldelade produkter` },
      { label: 'Produkter med minskad användning', value: String(declining), hint: 'visas i Förändringar', signal: declining > 0 },
    ]} />
    <StatisticsFocus focus={data.focus} />
    <StatisticsExplorer key={selected ?? 'recommended'} data={data} initialView={selected} />
    <section className="flex flex-col gap-5"><SectionHeader title="Fördjupa er i en produkt" description="Samma portfölj, med produktinformation och befintliga detaljvyer" /><ResourceExplorer rows={visibleResources} showCommercial={commercial} /></section>
  </>
}
