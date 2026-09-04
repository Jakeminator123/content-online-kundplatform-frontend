import { departmentUsage } from '@/lib/data'
import { fmtCompact } from '@/lib/format'

export function DepartmentBars() {
  const max = Math.max(...departmentUsage.map((d) => d.requests))
  return (
    <ul className="flex flex-col gap-4">
      {departmentUsage.map((d) => (
        <li key={d.code} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="font-mono text-xs text-primary">{d.code}</span>
              <span className="truncate text-foreground">{d.name}</span>
            </span>
            <span className="tnum shrink-0 font-mono text-xs text-muted-foreground">
              {fmtCompact(d.requests)} · {d.share} %
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(d.requests / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
