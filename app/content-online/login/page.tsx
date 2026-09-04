import Link from 'next/link'
import { redirect } from 'next/navigation'
import { hasOperatorSession } from '@/lib/operator-auth'
import { isLocalDemo } from '@/lib/backend-client'
import { operatorDemoLogin } from '../actions'

export default async function OperatorLoginPage() {
  if (await hasOperatorSession()) redirect('/content-online')
  const demo = isLocalDemo()
  return <main className="flex min-h-svh items-center justify-center bg-sidebar px-6 py-12">
    <section className="w-full max-w-lg rounded-2xl bg-card p-7 shadow-xl md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Content Online</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight">Personalportalen</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Se dina tilldelade kunder, följ användningen och hantera kundärenden.</p>
      <div className="mt-7 rounded-xl border bg-muted/40 p-5">
        <h2 className="font-medium">{demo ? 'Prova personalvyn' : 'Företagsinloggning'}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{demo
          ? 'Den lokala demon visar en tilldelad testkund och hämtar syntetiska uppgifter från backend.'
          : 'Personalens riktiga inloggning är ännu inte ansluten. Den här vyn öppnar inte kunddata i produktion.'}</p>
        {demo ? <form action={operatorDemoLogin} className="mt-5">
          <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Öppna personaldemo →</button>
        </form> : <p className="mt-4 text-xs text-muted-foreground">Status: väntar på företagets identitetsleverantör.</p>}
      </div>
      <Link href="/login" className="mt-7 inline-block text-sm text-primary underline underline-offset-4">Till kundernas inloggning</Link>
    </section>
  </main>
}
