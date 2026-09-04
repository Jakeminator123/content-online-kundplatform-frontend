'use client'

import { useState } from 'react'
import { ArrowUpRight, BookOpen, Download, Search, SlidersHorizontal } from 'lucide-react'
import type { Resource } from '@/lib/data'
import { fmtDate, fmtNumber, fmtSek } from '@/lib/format'
import { demoPortfolioCsv } from '@/lib/demo-export'
import { DemoDialog } from './demo-dialog'

export function ResourceExplorer({ rows, showCommercial = true }: { rows: Resource[]; showCommercial?: boolean }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('Alla typer')
  const [selected, setSelected] = useState<Resource | null>(null)
  const filtered = rows.filter(r => (type === 'Alla typer' || type === r.type) && `${r.title} ${r.publisher}`.toLocaleLowerCase('sv').includes(query.toLocaleLowerCase('sv')))
  const types = ['Alla typer', ...new Set(rows.map(r => r.type))]
  function download() {
    const url = URL.createObjectURL(new Blob([demoPortfolioCsv(filtered)], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url; link.download = 'KTH-produktportfolj-DEMO.csv'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <>
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex min-w-48 flex-1 items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2.5 text-sm focus-within:ring-2 focus-within:ring-ring"><Search className="size-4 text-muted-foreground" /><input aria-label="Sök produkter och publicister" className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Sök produkt eller publicist…" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-xs"><SlidersHorizontal className="size-3.5 text-muted-foreground" /><select aria-label="Filtrera på produkttyp" value={type} onChange={e => setType(e.target.value)} className="max-w-40 bg-transparent outline-none">{types.map(t => <option key={t}>{t}</option>)}</select></label>
      <button onClick={download} className="flex items-center gap-2 rounded-lg border bg-card px-3.5 py-2.5 text-xs font-medium hover:bg-accent"><Download className="size-3.5" />Exportera demo</button>
    </div>
    <p className="-mt-2 text-xs text-muted-foreground" aria-live="polite">{filtered.length} av {rows.length} tilldelade produkter</p>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(r => <button key={r.id} onClick={() => setSelected(r)} className="resource-tile group text-left">
      <div className="flex items-start justify-between gap-3"><span className="publisher-mark">{r.publisher === 'IEEE' ? 'IEEE' : r.publisher.slice(0,2).toUpperCase()}</span><span className={`status-chip ${r.status === 'Förnyelse snart' ? 'status-amber' : r.status === 'Aktiv' ? 'status-green' : ''}`}>{r.status}</span></div>
      <div className="my-5"><p className="mb-1 text-[11px] text-muted-foreground">{r.publisher} · {r.type}</p><h3 className="text-sm font-semibold leading-relaxed">{r.title}</h3></div>
      <div className="mt-auto flex items-end justify-between border-t pt-4"><div><p className="tnum text-lg font-semibold text-ink">{fmtNumber(r.requestsYtd)}</p><p className="mt-1 text-[10px] text-muted-foreground">användning · jan–aug, demo</p></div><ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
    </button>)}</div>
    {!filtered.length ? <div className="rounded-xl border border-dashed p-12 text-center"><BookOpen className="mx-auto mb-3 size-7 text-muted-foreground" /><p className="font-medium">Inga produkter matchar din sökning</p><button onClick={() => { setQuery(''); setType('Alla typer') }} className="mt-3 text-sm text-primary underline">Rensa filter</button></div> : null}
    <DemoDialog open={!!selected} title={selected?.title ?? 'Produkt'} onClose={() => setSelected(null)}>
      {selected ? <><p className="text-sm text-muted-foreground">{selected.publisher} · {selected.type}</p><dl className="my-6 grid grid-cols-2 gap-3">{[
        ['Organisation', 'KTH'], ['Portalstatus', 'Tilldelad i demokonfigurationen'], ['Användning, jan–aug', fmtNumber(selected.requestsYtd)], ['Förnyelse, demo', fmtDate(selected.renewal)], ...(showCommercial ? [['Årskostnad, demo', fmtSek(selected.annualCost)]] : []),
      ].map(([k,v]) => <div key={k} className="rounded-lg bg-muted/60 p-4"><dt className="mb-1.5 text-[11px] text-muted-foreground">{k}</dt><dd className="text-sm font-medium">{v}</dd></div>)}</dl><div className="rounded-lg border border-primary/10 bg-accent/50 p-4 text-xs leading-relaxed text-muted-foreground"><strong className="mb-1 block text-foreground">Källa och definition</strong>Syntetiskt presentationsunderlag · januari–augusti 2026. Användningen visar ett demoexempel per produkt. Ingen verifierad publicistimport eller extern licensprovisionering.</div></> : null}
    </DemoDialog>
  </>
}
