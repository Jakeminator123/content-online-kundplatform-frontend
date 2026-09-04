'use client'

import { useId, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { monthlyUsage } from '@/lib/data'
import { fmtCompact, fmtNumber } from '@/lib/format'

const config = {
  requests: { label: 'Fulltextnedladdningar', color: 'var(--chart-1)' },
  denials: { label: 'Nekade åtkomster', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function UsageChart({ showDenials = true }: { showDenials?: boolean }) {
  const gradientId = useId().replace(/:/g, '')
  const [period, setPeriod] = useState<'all' | 'recent'>('all')
  const values = period === 'recent' ? monthlyUsage.slice(-3) : monthlyUsage
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-chart-1" />Användning · demo</span><div className="flex rounded-md border bg-background p-0.5">{([['all','Jan–aug'],['recent','Senaste 3 mån.']] as const).map(([id,label])=><button key={id} onClick={()=>setPeriod(id)} aria-pressed={period===id} className={`rounded px-2.5 py-1 text-[10px] ${period===id ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground'}`}>{label}</button>)}</div></div>
    <ChartContainer config={config} className="aspect-auto h-64 w-full md:h-72">
      <AreaChart data={values} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-requests)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-requests)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          width={56}
          tickFormatter={(v) => fmtCompact(v)}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value, name, item) => (
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2 rounded-xs"
                      style={{ background: item.color }}
                    />
                    {config[name as keyof typeof config].label}
                  </span>
                  <span className="tnum font-mono">{fmtNumber(Number(value))}</span>
                </div>
              )}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="requests"
          stroke="var(--color-requests)"
          strokeWidth={2.5}
          isAnimationActive={false}
          fill={`url(#${gradientId})`}
        />
        {showDenials ? (
          <Area
            type="monotone"
            dataKey="denials"
            stroke="var(--color-denials)"
            strokeWidth={2.5}
          isAnimationActive={false}
            fill="transparent"
            strokeDasharray="4 4"
          />
        ) : null}
      </AreaChart>
    </ChartContainer>
    <p className="mt-3 text-[10px] text-muted-foreground">{period === 'all' ? 'Januari–augusti' : 'Juni–augusti'} 2026. {showDenials ? 'Streckad linje: nekade åtkomster.' : ''}</p>
    </div>
  )
}
