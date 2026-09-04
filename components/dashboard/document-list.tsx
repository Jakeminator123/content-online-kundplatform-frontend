"use client"

import { useState } from 'react'
import { ArrowUpRight, FileSpreadsheet, FileText, Presentation, Receipt, File } from 'lucide-react'
import type { Document } from '@/lib/data'
import { fmtDate } from '@/lib/format'
import { DemoDialog } from './demo-dialog'

function iconFor(doc: Document) {
  if (doc.name.endsWith('.xlsx')) return FileSpreadsheet
  if (doc.name.endsWith('.pptx')) return Presentation
  if (doc.category === 'Faktura') return Receipt
  if (doc.name.endsWith('.pdf')) return FileText
  return File
}

export function DocumentList({ items }: { items: Document[] }) {
  const [selected, setSelected] = useState<Document | null>(null)
  return <>
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {items.map(d => {
        const Icon = iconFor(d)
        return <li key={d.id}><button onClick={() => setSelected(d)} className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background text-primary"><Icon className="size-4" /></span>
          <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-xs font-medium md:text-sm">{d.name}</span><span className="mt-1.5 text-[10px] text-muted-foreground">{d.category} · {fmtDate(d.updatedAt)} · Demo</span></span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
        </button></li>
      })}
    </ul>
    <DemoDialog open={!!selected} title={selected?.name ?? 'Dokument'} onClose={() => setSelected(null)}>
      {selected ? <><div className="rounded-xl border bg-background p-6 md:p-8"><div className="mb-8 flex items-center justify-between"><span className="text-sm font-semibold">Content Online</span><span className="status-chip status-amber">EXEMPELDOKUMENT</span></div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">{selected.category} / KTH</p><h3 className="my-4 text-xl font-semibold leading-snug">{selected.name.replace(/\.[^.]+$/, '')}</h3><p className="text-sm leading-relaxed text-muted-foreground">Det här är en förhandsvisning av dokumentets information. Ingen verklig fil, faktura eller avtalstext har laddats upp.</p><dl className="mt-7 space-y-3 border-t pt-5 text-xs"><div className="flex justify-between"><dt>Organisation</dt><dd>KTH</dd></div><div className="flex justify-between"><dt>Datum i demo</dt><dd>{fmtDate(selected.updatedAt)}</dd></div><div className="flex justify-between"><dt>Källa</dt><dd>Syntetiskt presentationsunderlag</dd></div></dl></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground">Originalfil och nedladdning blir tillgängliga när säker dokumentlagring är ansluten.</p></> : null}
    </DemoDialog>
  </>
}
