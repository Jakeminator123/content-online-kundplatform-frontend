import { ShieldCheck, UserPlus, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader, SectionHeader } from '@/components/dashboard/page-header'
import { listUsers, requireAdmin } from '@/lib/auth'
import { organisation } from '@/lib/data'
import { fmtDate } from '@/lib/format'

export default async function AdminPage() {
  await requireAdmin()
  const users = listUsers()

  const settings = [
    { label: 'Organisation', value: organisation.fullName },
    { label: 'Enhet', value: organisation.unit },
    { label: 'Avtalsperiod', value: `${fmtDate(organisation.fiscalYearStart)} – ${fmtDate(organisation.fiscalYearEnd)}` },
    { label: 'Datakälla nyttjande', value: 'COUNTER 5.1 via SUSHI, hämtas den 5:e varje månad' },
    { label: 'Key Account Manager', value: organisation.accountManager.name },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Konton och inställningar"
        description="Hantera vem på KTH som har tillgång till portalen och vilken behörighet de har. Administratörer kan ladda upp dokument och bjuda in kollegor."
        action={
          <Button className="gap-2">
            <UserPlus className="size-4" />
            Bjud in kollega
          </Button>
        }
      />

      <section className="flex flex-col gap-5">
        <SectionHeader title="Användare" description={`${users.length} konton`} />
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Namn</TableHead>
                <TableHead>Roll på KTH</TableHead>
                <TableHead>Behörighet</TableHead>
                <TableHead className="pr-5 text-right">Åtgärd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.username}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                          {u.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{u.displayName}</span>
                        <span className="font-mono text-xs text-muted-foreground">@{u.username}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      {u.role === 'admin' ? (
                        <ShieldCheck className="size-3" />
                      ) : (
                        <UserRound className="size-3" />
                      )}
                      {u.role === 'admin' ? 'Administratör' : 'Personal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm">
                      Ändra
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader title="Organisationsinställningar" />
        <dl className="grid overflow-hidden rounded-xl border bg-card md:grid-cols-2">
          {settings.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1 p-5 ${i > 0 ? 'border-t' : ''} ${i % 2 === 1 ? 'md:border-l' : ''} ${i === 1 ? 'md:border-t-0' : ''}`}
            >
              <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
              <dd className="text-sm">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
