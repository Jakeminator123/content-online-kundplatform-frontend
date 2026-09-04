import { LoginForm } from '@/components/login/login-form'
import Link from 'next/link'
import { OrgMark } from '@/components/org-mark'
import { organisation, totals } from '@/lib/data'
import { fmtCompact, fmtPercent, fmtSekPrecise } from '@/lib/format'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  const facts = [
    { label: 'Användning · demo', value: fmtCompact(totals.requestsYtd) },
    { label: 'Tillväxt mot föregående år', value: fmtPercent(totals.requestsGrowth, true) },
    { label: 'Årsbudget / användning · demo', value: fmtSekPrecise(totals.costPerRequest) },
  ]

  return (
    <main className="grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex xl:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <header className="relative flex items-center gap-3">
          <OrgMark className="size-9" inverted />
          <div className="leading-tight">
            <p className="text-sm font-medium text-sidebar-primary">{organisation.unit}</p>
            <p className="text-xs text-sidebar-foreground/70">Kundportal · Content Online</p>
          </div>
        </header>

        <div className="relative flex flex-col gap-10">
          <h1 className="max-w-md text-balance text-4xl font-medium leading-[1.1] tracking-tight text-sidebar-primary xl:text-5xl">
            Kunskapen ni behöver. Överblicken ni saknar.
          </h1>
          <dl className="grid max-w-lg grid-cols-3 gap-6 border-t border-sidebar-border pt-6">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <dd className="tnum font-mono text-2xl text-sidebar-primary">{f.value}</dd>
                <dt className="text-xs leading-relaxed text-sidebar-foreground/70">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative text-xs text-sidebar-foreground/60">
          Avtalsår {organisation.contractYear} · {organisation.fullName}
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex items-center gap-3 lg:hidden">
            <OrgMark className="size-9" />
            <p className="text-sm font-medium">{organisation.unit}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">KTH / KUNDPORTAL</p><h2 className="text-3xl font-semibold tracking-tight">Välkommen in.</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Välj Hampus eller Bibbi nedan för att utforska KTH:s demoportal. Riktig kundinloggning är ännu inte ansluten.
            </p>
          </div>
          <LoginForm next={next} />
          <Link href="/content-online/login" className="text-sm font-medium text-primary underline underline-offset-4">
            Intern inloggning för Content Online →
          </Link>
          <p className="text-xs text-muted-foreground">Demomiljö med exempeldata. KTH:s riktiga inloggning är inte ansluten.</p>
          <a href="https://content-online-platform.vercel.app/demo" className="rounded-xl border bg-card p-4 text-sm"><span className="mb-1 block font-medium">Vill du se systemägarens arbetsyta? ↗</span><span className="text-xs text-muted-foreground">Utforska Content Online-demo utan inloggning.</span></a>
        </div>
      </section>
    </main>
  )
}
