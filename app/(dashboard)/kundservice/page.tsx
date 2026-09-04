import { requireUser } from '@/lib/auth'
import { BackendWorkspace } from '@/components/backend/workspace'
import { ServiceDemo } from '@/components/dashboard/service-demo'
import { PageHeader } from '@/components/dashboard/page-header'
import { isLocalDemo } from '@/lib/backend-client'
import { createCustomerTicket } from './actions'

export default async function CustomerServicePage({ searchParams }: { searchParams: Promise<{ arende?: string }> }) {
  const user = await requireUser()
  const { arende } = await searchParams
  const categories: Record<string, string> = { offert: 'Förnyelse och offert', anvandare: 'Användare och kundroller', dokument: 'Dokument' }
  return <>
    <PageHeader eyebrow="KTH / KUNDSERVICE" title="En kontakt. För hela er portfölj." description="Frågor om resurser, användare eller förnyelser? Här börjar dialogen med Content Online." />
    {isLocalDemo(process.env) ? <BackendWorkspace actor={user.role} action={createCustomerTicket} /> : <ServiceDemo initialCategory={categories[arende ?? ''] ?? 'Resurser och användning'} />}
  </>
}
