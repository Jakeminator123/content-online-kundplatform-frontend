import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { requireUser } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const dateLabel = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="flex min-h-svh">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} dateLabel={dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} />
        <main className="flex-1 px-4 py-8 md:px-8 lg:py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
