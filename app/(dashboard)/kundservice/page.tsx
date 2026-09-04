import { requireUser } from '@/lib/auth'
import { BackendWorkspace } from '@/components/backend/workspace'
import { createCustomerTicket } from './actions'

export default async function CustomerServicePage() {
  const user = await requireUser()
  return <>
    <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Content Online</p><h1 className="mt-2 text-3xl font-medium tracking-tight">Kundservice & källdata</h1>
      <p className="mt-3 text-sm text-muted-foreground">Följ dina resurser och skapa ett ärende till Content Online.</p>
    </div>
    <BackendWorkspace actor={user.role} action={createCustomerTicket} />
  </>
}
