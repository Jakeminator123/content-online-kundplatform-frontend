import Link from 'next/link'
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react'
import { DocumentList } from '@/components/dashboard/document-list'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { NewsList } from '@/components/dashboard/news-list'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { ResourceExplorer } from '@/components/dashboard/resource-explorer'
import { StatisticsFocus } from '@/components/dashboard/statistics-focus'
import { UsageChart } from '@/components/dashboard/usage-chart'
import { requireUser } from '@/lib/auth'
import { documents, news, organisation, resources, totals } from '@/lib/data'
import { fmtCompact, fmtNumber, fmtPercent, fmtSekPrecise } from '@/lib/format'
import { getStatisticsData } from '@/lib/statistics'

export default async function OverviewPage() {
  const user = await requireUser()
  const commercial = user.role === 'admin'
  const focus = getStatisticsData(commercial).focus
  const renewals = resources.filter(r => r.status === 'Förnyelse snart').sort((a,b) => a.renewal.localeCompare(b.renewal))
  const visibleDocuments = commercial ? documents : documents.filter(d => !['Avtal','Faktura'].includes(d.category))
  const visibleResources = resources.map(r => ({ ...r, annualCost: commercial ? r.annualCost : 0 }))
  return <>
    <PageHeader eyebrow={`${organisation.name} / ER ÖVERBLICK`} title={`Välkommen, ${user.displayName}.`} description="Er kunskap, samlad. Följ hur resurserna används och se vad som är nästa steg för KTH." action={<span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5" />Januari–augusti 2026</span>} />
    <KpiStrip items={[
      {label:'Användning i år · demo',value:fmtCompact(totals.requestsYtd),delta:{value:fmtPercent(totals.requestsGrowth,true),positive:totals.requestsGrowth>=0},hint:'mot samma period'},
      commercial ? {label:'Årsbudget / användning',value:fmtSekPrecise(totals.costPerRequest),hint:'syntetiskt jämförelsemått'} : {label:'Publicister i portföljen',value:String(new Set(resources.map(r=>r.publisher)).size),hint:'tilldelade produkter'},
      {label:'Tilldelade produkter',value:String(resources.length),hint:`${renewals.length} förnyelser att följa`},
      {label:'Efterfrågan utan tillgång',value:fmtNumber(totals.denialsYtd),hint:'nekade åtkomster · demo',signal:true},
    ]} />
    <StatisticsFocus focus={focus} />
    <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
      <div className="min-w-0 rounded-xl border bg-card p-5 md:p-6"><SectionHeader title="Kunskap i användning" description="Produktanvändning månad för månad · syntetiska exempel" /><div className="mt-6"><UsageChart /></div></div>
      <div className="flex flex-col rounded-xl border bg-card p-5 md:p-6"><SectionHeader title="Nästa i er kalender" description="Förnyelser i demoportföljen" /><div className="my-3 flex-1">{renewals.map(r=><div key={r.id} className="flex items-center gap-3 border-b py-4 last:border-0"><div className="grid w-11 shrink-0 place-items-center rounded-lg bg-background py-2"><span className="text-[9px] uppercase tracking-wider text-muted-foreground">{r.renewal.slice(5,7)==='09'?'SEP':'DEC'}</span><span className="text-lg font-semibold">{r.renewal.slice(-2)}</span></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{r.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{r.publisher} · förnyelse, demo</p></div></div>)}</div><Link href="/kundservice?arende=offert" className="flex items-center justify-between border-t pt-4 text-xs font-medium text-primary">Förbered förnyelsedialogen<ArrowRight className="size-3.5" /></Link></div>
    </section>
    <Link href="/efterfragan" className="flex items-center gap-4 rounded-xl border border-[#e8dfce] bg-[#fcf8ef] p-5"><span className="rounded-lg bg-[#f3ead7] p-2.5 text-[#967746]"><Sparkles className="size-5" /></span><div className="flex-1"><h2 className="text-sm font-semibold">Vad efterfrågar era forskare?</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Upptäck luckorna i beståndet och förbered en bättre inköpsdialog.</p></div><ArrowRight className="size-4 text-[#967746]" /></Link>
    <section className="flex flex-col gap-5"><SectionHeader title="Era informationsprodukter" description="Tilldelat till KTH · öppna en produkt för detaljer" /><ResourceExplorer rows={visibleResources} showCommercial={commercial} /></section>
    <section className="grid gap-6 xl:grid-cols-2"><div className="flex flex-col gap-4"><SectionHeader title="Utvalt för er" description="Nyhetsexempel från publicisterna" action={<Link href="/nyheter" className="text-xs text-primary">Visa alla →</Link>} /><NewsList items={news.slice(0,3)} /></div><div className="flex flex-col gap-4"><SectionHeader title="Dokumenten nära till hands" description="Klicka för att förhandsvisa" action={<Link href="/dokument" className="text-xs text-primary">Alla dokument →</Link>} /><DocumentList items={[...visibleDocuments].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,4)} /></div></section>
    <p className="text-[10px] leading-relaxed text-muted-foreground">Källa: Content Online presentationsdata · januari–augusti 2026. Användning är ett syntetiskt produktmått. Årsbudget / användning delar exempelportföljens årsbudget med periodens användning; det är inte en periodiserad kostnadsrapport.</p>
  </>
}
