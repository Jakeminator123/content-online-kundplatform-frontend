import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Kpi = { label: string; value: string; delta?: { value: string; positive: boolean }; hint?: string; signal?: boolean }

export function KpiStrip({ items }: { items: Kpi[] }) {
  return <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {items.map(item => {
      const decreasing = /^[−-]/.test(item.delta?.value ?? '')
      const Arrow = decreasing ? ArrowDownRight : ArrowUpRight
      return <div key={item.label} className="metric-tile">
        <dt className="flex items-center gap-2 text-[11px] text-muted-foreground">{item.signal ? <span className="size-1.5 rounded-full bg-signal" /> : null}{item.label}</dt>
        <dd><span className="tnum my-4 block text-[27px] font-semibold leading-none tracking-[-.05em] text-ink md:text-[34px]">{item.value}</span>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] leading-relaxed">{item.delta ? <span className={cn('inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium', item.delta.positive ? 'bg-[#e9f4ee] text-[#287a58]' : 'bg-signal-soft text-signal-foreground')}><Arrow className="size-3" />{item.delta.value}</span> : null}<span className="text-muted-foreground">{item.hint}</span></div>
        </dd>
      </div>
    })}
  </dl>
}
