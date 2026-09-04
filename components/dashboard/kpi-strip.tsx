import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Kpi = {
  label: string
  value: string
  delta?: { value: string; positive: boolean }
  hint?: string
  signal?: boolean
}

export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-xl border bg-card lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            'flex flex-col gap-3 p-5 md:p-6',
            i % 2 === 1 && 'border-l',
            i >= 2 && 'border-t lg:border-t-0',
            i >= 1 && 'lg:border-l',
            item.signal && 'bg-signal-soft',
          )}
        >
          <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
          <dd className="flex flex-col gap-1.5">
            <span className="tnum font-mono text-2xl tracking-tight md:text-3xl">{item.value}</span>
            {item.delta ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  item.delta.positive ? 'text-primary' : 'text-signal-foreground',
                )}
              >
                {item.delta.positive ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {item.delta.value}
                {item.hint ? <span className="font-normal text-muted-foreground"> {item.hint}</span> : null}
              </span>
            ) : item.hint ? (
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
