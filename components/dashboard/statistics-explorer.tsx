'use client'

import { useId, useState } from 'react'
import type { StatisticsData } from '@/lib/statistics'
import type { StatisticsView } from '@/lib/statistics-policy'

const number = (n: number) => new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n)
const money = (n: number) => new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(n)
const ratio = (n: number) => new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const change = (current: number, previous: number) => previous > 0 ? (current / previous - 1) * 100 : null
const percent = (value: number | null) => value === null ? 'Ingen jämförelse' : `${value > 0 ? '+' : ''}${new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 }).format(value)} %`
const views: { id: StatisticsView; title: string; description: string }[] = [
  { id: 'trend', title: 'Över tid', description: 'Månadsmönstret i er användning, sökningar och nekade åtkomster.' },
  { id: 'products', title: 'Produkter', description: 'Vilka delar av portföljen används mest under perioden?' },
  { id: 'publishers', title: 'Publicister', description: 'Produktanvändning samlad per publicist i demoportföljen.' },
  { id: 'schools', title: 'Skolor', description: 'Syntetisk fördelning mellan KTH:s skolor – inte uppmätt individdata.' },
  { id: 'changes', title: 'Förändringar', description: 'Både ökningar och minskningar jämfört med januari–augusti föregående år.' },
  { id: 'demand', title: 'Efterfrågan', description: 'Nekade åtkomster och orsaker – en signal för uppföljning, inte ett köpbeslut.' },
  { id: 'renewals', title: 'Förnyelser', description: 'Användning inför nästa avtalsdialog. Datumen tillhör demoportföljen.' },
  { id: 'budget', title: 'Budget', description: 'Årsbudget jämförd med användning under januari–augusti. Endast för kundadministratörer.' },
]

function Bars({ rows, label = 'Användning' }: { rows: { id: string; title: string; subtitle?: string; value: number }[]; label?: string }) {
  const max = Math.max(1, ...rows.map(r => r.value))
  return <div className="statistics-bars">{rows.map(row => <div key={row.id} className="statistics-bar-row"><div className="statistics-bar-label"><div><strong>{row.title}</strong>{row.subtitle && <small>{row.subtitle}</small>}</div><span aria-label={`${label}: ${number(row.value)}`}>{number(row.value)}</span></div><div className="statistics-bar-track" aria-hidden="true"><span style={{ width: `${Math.max(0, row.value / max * 100)}%` }} /></div></div>)}</div>
}

function Trend({ months }: { months: StatisticsData['months'] }) {
  const [metric, setMetric] = useState<'requests' | 'searches' | 'denials'>('requests')
  const gradient = useId().replace(/:/g, '')
  const labels = { requests: 'Användning', searches: 'Sökningar', denials: 'Nekade åtkomster' }
  const max = Math.max(1, ...months.map(m => m[metric])) * 1.15
  const points = months.map((m, i) => [65 + i * (830 / Math.max(1, months.length - 1)), 215 - m[metric] / max * 175])
  const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
  const area = points.length ? `${line} L${points.at(-1)![0]},215 L65,215 Z` : ''
  return <><div className="statistics-chart-toolbar"><div className="statistics-series" aria-label="Välj mått">{(Object.keys(labels) as (keyof typeof labels)[]).map(key => <button key={key} type="button" aria-pressed={metric === key} onClick={() => setMetric(key)}>{labels[key]}</button>)}</div><span>{number(months.reduce((sum, m) => sum + m[metric], 0))} under perioden</span></div>
    <div className="statistics-plot"><svg viewBox="0 0 950 260" role="img" aria-label={`${labels[metric]} januari till augusti 2026. Exakta värden finns i tabellen nedanför.`}>
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".18" /><stop offset="100%" stopColor="currentColor" stopOpacity=".01" /></linearGradient></defs>
      {[0, 1, 2, 3].map(tick => <g key={tick}><line x1="65" x2="895" y1={215 - tick * 175 / 3} y2={215 - tick * 175 / 3} stroke="var(--border)" strokeDasharray="4 5" /><text x="50" y={219 - tick * 175 / 3} textAnchor="end" className="statistics-axis">{new Intl.NumberFormat('sv-SE', { notation: 'compact', maximumFractionDigits: 0 }).format(max * tick / 3)}</text></g>)}
      <path d={area} fill={`url(#${gradient})`} /><path d={line} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      {points.map(([x, y], i) => <g key={months[i].month}><circle cx={x} cy={y} r="4" fill="currentColor" /><text x={x} y="249" textAnchor="middle" className="statistics-axis">{months[i].month}</text></g>)}
    </svg></div>
    <details className="statistics-data"><summary>Visa diagrammets värden i tabell</summary><div className="statistics-table-wrap"><table><caption>{labels[metric]} · syntetiska exempel</caption><thead><tr><th scope="col">Månad</th><th scope="col">{labels[metric]}</th></tr></thead><tbody>{months.map(m => <tr key={m.month}><th scope="row">{m.month}</th><td>{number(m[metric])}</td></tr>)}</tbody></table></div></details>
  </>
}

export function StatisticsExplorer({ data, initialView }: { data: StatisticsData; initialView?: string }) {
  const available = views.filter(view => view.id !== 'budget' || data.commercial)
  const defaultView = available.some(v => v.id === initialView) ? initialView as StatisticsView : data.focus.recommendations.find(r => available.some(v => v.id === r.view))?.view ?? 'trend'
  const [active, setActive] = useState<StatisticsView>(defaultView)
  const current = available.find(view => view.id === active) ?? available[0]
  const recommendation = data.focus.recommendations.find(item => item.view === current.id)
  const total = data.rows.reduce((sum, r) => sum + r.requestsYtd, 0)
  const publishers = [...data.rows.reduce((map, r) => {
    const item = map.get(r.publisher) ?? { id: r.publisher, title: r.publisher, value: 0, count: 0 }
    item.value += r.requestsYtd; item.count += 1; map.set(r.publisher, item); return map
  }, new Map<string, { id: string; title: string; value: number; count: number }>()).values()].sort((a, b) => b.value - a.value)
  const sorted = [...data.rows].sort((a, b) => b.requestsYtd - a.requestsYtd)
  const changed = [...data.rows].sort((a, b) => (change(a.requestsYtd, a.requestsPrevYtd) ?? Infinity) - (change(b.requestsYtd, b.requestsPrevYtd) ?? Infinity))
  const renewals = [...data.rows].sort((a, b) => a.renewal.localeCompare(b.renewal))
  const choose = (id: StatisticsView) => {
    setActive(id)
    const url = new URL(window.location.href); url.searchParams.set('vy', id)
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }
  return <section className="statistics-explorer" aria-labelledby="statistics-heading">
    <div className="statistics-top"><div><p className="focus-kicker">ER STATISTIK / KTH</p><h2 id="statistics-heading">En portfölj. Flera perspektiv.</h2></div><span className="statistics-period">{data.period} · demo</span></div>
    <div className="statistics-tabs" role="group" aria-label="Statistikvyer">{available.map(view => <button key={view.id} type="button" onClick={() => choose(view.id)} aria-pressed={current.id === view.id} aria-controls="statistics-content">{view.title}{view.id === 'budget' && <span className="statistics-role">Admin</span>}</button>)}</div>
    <div id="statistics-content" className="statistics-content"><div className="statistics-panel-heading"><h3>{current.title}</h3><p>{current.description}</p></div>
      {recommendation && <p className="statistics-reason"><strong>Utvalt för er:</strong> {recommendation.reason}</p>}
      {current.id === 'trend' && <Trend months={data.months} />}
      {current.id === 'products' && <Bars rows={sorted.map(r => ({ id: r.id, title: r.title, subtitle: r.publisher, value: r.requestsYtd }))} />}
      {current.id === 'publishers' && <Bars rows={publishers.map(p => ({ ...p, subtitle: `${p.count} ${p.count === 1 ? 'produkt' : 'produkter'} · ${total > 0 ? ratio(p.value / total * 100) : '0'} % av användningen` }))} />}
      {current.id === 'schools' && <Bars rows={data.schools.map(s => ({ id: s.code, title: s.code, subtitle: s.name, value: s.requests }))} />}
      {current.id === 'changes' && <div className="statistics-table-wrap"><table><caption>Januari–augusti 2026 jämfört med samma period 2025 · demo</caption><thead><tr><th scope="col">Produkt</th><th scope="col">2025</th><th scope="col">2026</th><th scope="col">Förändring</th></tr></thead><tbody>{changed.map(r => { const delta = change(r.requestsYtd, r.requestsPrevYtd); return <tr key={r.id}><th scope="row">{r.title}<small>{r.publisher}</small></th><td>{number(r.requestsPrevYtd)}</td><td>{number(r.requestsYtd)}</td><td><span className={`statistics-delta ${delta !== null && delta < 0 ? 'down' : 'up'}`}>{percent(delta)}</span></td></tr> })}</tbody></table></div>}
      {current.id === 'demand' && <Bars rows={[...data.demand].sort((a, b) => b.denialsYtd - a.denialsYtd).map(r => ({ id: r.id, title: r.title, subtitle: r.reason, value: r.denialsYtd }))} label="Nekade åtkomster" />}
      {current.id === 'renewals' && <div className="statistics-table-wrap"><table><caption>Demoportföljens datum · bedömt {data.asOf}</caption><thead><tr><th scope="col">Produkt</th><th scope="col">Förnyelse</th><th scope="col">Användning i perioden</th><th scope="col">Tid till förnyelse</th></tr></thead><tbody>{renewals.map(r => { const days = Math.round((Date.parse(r.renewal + 'T00:00:00Z') - Date.parse(data.asOf + 'T00:00:00Z')) / 86400000); return <tr key={r.id}><th scope="row">{r.title}<small>{r.publisher}</small></th><td>{r.renewal}</td><td>{number(r.requestsYtd)}</td><td><span className={days <= 90 ? 'statistics-delta down' : ''}>{days < 0 ? 'Datum passerat' : days === 0 ? 'I dag' : `${days} dagar`}</span></td></tr> })}</tbody></table></div>}
      {current.id === 'budget' && data.commercial && <><p className="statistics-notice">Årsbudget är inte kostnaden för januari–augusti. Kvoten nedan får inte beskrivas som faktisk kostnad per nedladdning eller automatiskt som ”bäst värde”.</p><div className="statistics-table-wrap"><table><caption>Budgetunderlag · syntetiska belopp i SEK</caption><thead><tr><th scope="col">Produkt</th><th scope="col">Årsbudget 2026</th><th scope="col">Användning jan–aug</th><th scope="col">Årsbudget ÷ användning</th></tr></thead><tbody>{sorted.map(r => <tr key={r.id}><th scope="row">{r.title}</th><td>{r.annualCost === undefined ? 'Saknas' : money(r.annualCost)}</td><td>{number(r.requestsYtd)}</td><td>{r.annualCost !== undefined && r.requestsYtd > 0 ? `${ratio(r.annualCost / r.requestsYtd)} kr` : 'Kan inte beräknas'}</td></tr>)}</tbody></table></div></>}
    </div>
    <footer className="statistics-footer"><strong>Underlag, inte facit.</strong> Content Online presentationsdata · {data.period.toLocaleLowerCase('sv-SE')}. Användning är ett syntetiskt produktmått, inte unika personer eller en verifierad COUNTER-rapport. Jämförelser mellan verkliga källor kräver förenliga definitioner.</footer>
  </section>
}
