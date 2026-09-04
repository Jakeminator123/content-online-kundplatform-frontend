'use client'

import { useState } from 'react'
import { ArrowRight, FileText, MessageSquare, ShieldCheck } from 'lucide-react'
import { DemoDialog } from './demo-dialog'

export function ServiceDemo({ initialCategory = 'Resurser och användning' }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)
  return <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
    <section className="rounded-xl border bg-card p-6 md:p-7"><div className="mb-6 flex items-center gap-3"><span className="rounded-lg bg-accent p-2.5 text-primary"><MessageSquare className="size-5" /></span><div><h2 className="text-lg font-semibold">Vad kan vi hjälpa dig med?</h2><p className="text-xs text-muted-foreground">Förhandsvisa ett ärende till Content Online</p></div></div>
      <form onSubmit={e => { e.preventDefault(); setPreview(true) }} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-xs font-medium">Ärendetyp<select value={category} onChange={e => setCategory(e.target.value)} className="rounded-lg border bg-background p-3 text-sm">{['Resurser och användning','Användare och kundroller','Tillgång och licenser','Förnyelse och offert','Dokument'].map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="flex flex-col gap-2 text-xs font-medium">Rubrik<input value={subject} onChange={e => setSubject(e.target.value)} maxLength={120} minLength={3} required placeholder="Till exempel: fråga om IEEE Xplore" className="rounded-lg border bg-background p-3 text-sm" /></label>
        <label className="flex flex-col gap-2 text-xs font-medium">Din fråga<textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={2000} minLength={10} required rows={5} placeholder="Beskriv vad du vill få hjälp med. Använd bara påhittade uppgifter i demon." className="resize-y rounded-lg border bg-background p-3 text-sm" /></label>
        <p className="text-xs leading-relaxed text-muted-foreground">Visningsdemo. Inget skickas eller sparas. Texten försvinner när sidan laddas om.</p><button type="submit" className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Förhandsvisa ärende<ArrowRight className="size-4" /></button>
      </form>
    </section>
    <div className="flex flex-col gap-5"><section className="rounded-xl border bg-card p-6"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">ER KUNDRELATION</p><h2 className="mt-3 text-xl font-semibold">Content Online</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">En kontakt för era informationsprodukter, förnyelser och tilldelningar.</p><div className="mt-5 border-t pt-4"><p className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="size-4 text-primary" />KTH:s egna ärenden</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Kundadministratören får organisationens överblick. Läsaren följer sina egna frågor.</p></div></section><section className="rounded-xl border border-dashed p-6"><FileText className="mb-3 size-5 text-muted-foreground" /><h3 className="text-sm font-semibold">Ärendehistorik</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Här kommer bekräftade ärenden och svar att visas när kundservice är ansluten.</p></section></div>
    <DemoDialog open={preview} title="Så här skulle ärendet se ut" onClose={() => setPreview(false)}><span className="status-chip status-amber">UTKAST · INTE SKICKAT</span><p className="mt-5 text-xs text-muted-foreground">KTH / {category}</p><h3 className="mt-2 text-lg font-semibold">{subject}</h3><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{message}</p><p className="mt-6 rounded-lg bg-accent p-4 text-xs leading-relaxed">Detta är bara en förhandsvisning. Inget ärende har skapats, skickats eller lagrats.</p></DemoDialog>
  </div>
}
