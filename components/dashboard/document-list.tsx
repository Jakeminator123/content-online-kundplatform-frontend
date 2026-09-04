import { Download, FileSpreadsheet, FileText, Presentation, Receipt, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Document } from '@/lib/data'
import { fmtDate } from '@/lib/format'

function iconFor(doc: Document) {
  if (doc.name.endsWith('.xlsx')) return FileSpreadsheet
  if (doc.name.endsWith('.pptx')) return Presentation
  if (doc.category === 'Faktura') return Receipt
  if (doc.name.endsWith('.pdf')) return FileText
  return File
}

export function DocumentList({ items }: { items: Document[] }) {
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {items.map((d) => {
        const Icon = iconFor(d)
        return (
          <li key={d.id} className="flex items-center gap-4 px-5 py-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{d.name}</span>
              <span className="text-xs text-muted-foreground">
                {d.category}
                {d.publisher ? ` · ${d.publisher}` : ''} · {d.size} · {fmtDate(d.updatedAt)} ·{' '}
                {d.uploadedBy}
              </span>
            </div>
            <Button variant="ghost" size="icon" aria-label={`Ladda ner ${d.name}`}>
              <Download className="size-4" />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
