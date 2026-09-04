import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Resource } from '@/lib/data'
import { fmtDate, fmtNumber, fmtPercent, fmtSek, fmtSekPrecise } from '@/lib/format'
import { cn } from '@/lib/utils'

const statusStyle: Record<Resource['status'], string> = {
  Aktiv: 'bg-accent text-accent-foreground border-transparent',
  'Förnyelse snart': 'bg-signal-soft text-signal-foreground border-transparent',
  'Under utvärdering': 'bg-muted text-muted-foreground border-transparent',
}

export function ResourceTable({
  rows,
  compact = false,
}: {
  rows: Resource[]
  compact?: boolean
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Resurs</TableHead>
            {!compact ? <TableHead>Typ</TableHead> : null}
            <TableHead className="text-right">Nedladdningar</TableHead>
            <TableHead className="text-right">Δ mot fg. år</TableHead>
            {!compact ? <TableHead className="text-right">Årskostnad</TableHead> : null}
            <TableHead className="text-right">Kr / nedladdning</TableHead>
            {!compact ? <TableHead>Förnyelse</TableHead> : null}
            <TableHead className="pr-5 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const delta = ((r.requestsYtd - r.requestsPrevYtd) / r.requestsPrevYtd) * 100
            return (
              <TableRow key={r.id}>
                <TableCell className="pl-5">
                  <div className="flex flex-col">
                    <span className="font-medium">{r.title}</span>
                    <span className="text-xs text-muted-foreground">{r.publisher}</span>
                  </div>
                </TableCell>
                {!compact ? (
                  <TableCell className="text-muted-foreground">{r.type}</TableCell>
                ) : null}
                <TableCell className="tnum text-right font-mono">{fmtNumber(r.requestsYtd)}</TableCell>
                <TableCell
                  className={cn(
                    'tnum text-right font-mono',
                    delta >= 0 ? 'text-primary' : 'text-signal-foreground',
                  )}
                >
                  {fmtPercent(delta, true)}
                </TableCell>
                {!compact ? (
                  <TableCell className="tnum text-right font-mono">{fmtSek(r.annualCost)}</TableCell>
                ) : null}
                <TableCell className="tnum text-right font-mono">
                  {fmtSekPrecise(r.annualCost / r.requestsYtd)}
                </TableCell>
                {!compact ? (
                  <TableCell className="text-muted-foreground">{fmtDate(r.renewal)}</TableCell>
                ) : null}
                <TableCell className="pr-5 text-right">
                  <Badge className={cn('font-normal', statusStyle[r.status])}>{r.status}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
