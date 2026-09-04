import { ArrowUpRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Turnaway } from '@/lib/data'
import { fmtNumber, fmtPercent, fmtSek, fmtSekPrecise } from '@/lib/format'

export function TurnawayCard({ item, rank }: { item: Turnaway; rank?: number }) {
  const costPerDenial = item.estimatedCost / item.denialsYtd
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-signal/40 bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {item.publisher} · {item.type}
          </p>
          <h3 className="text-balance font-medium leading-snug">{item.title}</h3>
        </div>
        {rank ? (
          <span className="tnum shrink-0 rounded-md bg-signal-soft px-2 py-1 font-mono text-xs text-signal-foreground">
            #{rank}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-4 border-t pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="tnum font-mono text-xl text-signal-foreground">{fmtNumber(item.denialsYtd)}</span>
          <span className="text-xs text-muted-foreground">nekade i år</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="tnum font-mono text-xl">{fmtPercent(item.trend, true)}</span>
          <span className="text-xs text-muted-foreground">mot fg. år</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="tnum flex items-center gap-1 font-mono text-xl">
            <Users className="size-3.5 text-muted-foreground" />
            {fmtNumber(item.uniqueUsers)}
          </span>
          <span className="text-xs text-muted-foreground">unika användare</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>
          Störst efterfrågan: <span className="font-mono text-foreground">{item.topDepartment}</span>
        </span>
        <span>
          Ca {fmtSek(item.estimatedCost)}/år · {fmtSekPrecise(costPerDenial)} per nekad
        </span>
      </div>

      <Button variant="outline" size="sm" className="justify-between">
        Begär offert
        <ArrowUpRight className="size-4" />
      </Button>
    </article>
  )
}
