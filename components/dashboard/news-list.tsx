import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/lib/data'
import { fmtDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const tagStyle: Record<NewsItem['tag'], string> = {
  'Ny produkt': 'bg-accent text-accent-foreground border-transparent',
  Uppdatering: 'bg-muted text-muted-foreground border-transparent',
  Erbjudande: 'bg-signal-soft text-signal-foreground border-transparent',
  Webinar: 'bg-muted text-muted-foreground border-transparent',
}

export function NewsList({ items, detailed = false }: { items: NewsItem[]; detailed?: boolean }) {
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {items.map((n) => (
        <li key={n.id}>
          <a
            href="#"
            className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/50 md:flex-row md:items-start md:gap-6"
          >
            <div className="flex shrink-0 flex-col gap-1 md:w-36">
              <span className="text-xs text-muted-foreground">{fmtDate(n.date)}</span>
              <span className="text-sm font-medium">{n.publisher}</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn('font-normal', tagStyle[n.tag])}>{n.tag}</Badge>
                <span className="text-xs text-primary">{n.relevance}</span>
              </div>
              <h3 className="text-balance font-medium leading-snug">{n.title}</h3>
              {detailed ? (
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {n.summary}
                </p>
              ) : null}
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
