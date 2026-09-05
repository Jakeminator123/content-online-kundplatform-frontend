import 'server-only'
import { departmentUsage, monthlyUsage, resources, turnaways } from './data'
import { selectStatisticsViews } from './statistics-policy'

export function getStatisticsData(commercial: boolean, now = new Date()) {
  // Project on the server: readers never receive financial fields through these client props.
  const rows = resources.map(r => ({
    id: r.id, title: r.title, publisher: r.publisher, type: r.type,
    requestsYtd: r.requestsYtd, requestsPrevYtd: r.requestsPrevYtd, renewal: r.renewal,
    ...(commercial ? { annualCost: r.annualCost } : {}),
  }))
  const demand = turnaways.map(r => ({ id: r.id, title: r.title, publisher: r.publisher, denialsYtd: r.denialsYtd, reason: r.reason }))
  return {
    rows, months: monthlyUsage.map(m => ({ ...m })), schools: departmentUsage.map(s => ({ ...s })), demand,
    commercial, period: 'Januari–augusti 2026', asOf: now.toISOString().slice(0, 10),
    focus: selectStatisticsViews({
      organizationId: 'customer-kth-demo', resources: rows,
      denials: demand.reduce((sum, row) => sum + row.denialsYtd, 0),
      commercial, periodEnd: '2026-08-31', now,
    }),
  }
}
export type StatisticsData = ReturnType<typeof getStatisticsData>
