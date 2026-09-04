'use client'

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
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full md:h-72">
      <AreaChart data={monthlyUsage} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-requests)" stopOpacity={0.25} />
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
          strokeWidth={2}
          fill="url(#fillRequests)"
        />
        {showDenials ? (
          <Area
            type="monotone"
            dataKey="denials"
            stroke="var(--color-denials)"
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="4 4"
          />
        ) : null}
      </AreaChart>
    </ChartContainer>
  )
}
