import Link from 'next/link'
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import type { StatisticsFocus as Focus } from '@/lib/statistics-policy'

export function StatisticsFocus({ focus }: { focus: Focus }) {
  return <section className="focus-section" aria-labelledby="statistics-focus-title">
    <div className="focus-heading"><div><p className="focus-kicker"><SlidersHorizontal size={14} /> UTVALT FÖR KTH</p><h2 id="statistics-focus-title">Börja med det som behöver er uppmärksamhet.</h2></div><span className="focus-method">Automatiskt urval · demodata</span></div>
    <div className="focus-grid">{focus.recommendations.map((item, index) => <Link key={item.view} href={`/anvandning?vy=${item.view}`} className="focus-link">
      <div className="focus-link-top"><span className={`focus-signal ${item.signal}`}>{item.signal === 'attention' ? 'Att följa upp' : item.signal === 'opportunity' ? 'Positiv utveckling' : 'Fördjupning'}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      <h3><span className="focus-index">0{index + 1}</span>{item.title}</h3><p>{item.reason}</p>
    </Link>)}</div>
    {focus.warnings.map(warning => <p key={warning} className="statistics-notice">{warning}</p>)}
    <p className="focus-explainer">Urvalet väger samman förändringar, nekad åtkomst och kommande förnyelser. Regelbaserat och förklarbart – inte en AI-prognos.</p>
  </section>
}
