import { Mail, Phone } from 'lucide-react'
import { OrgMark } from '@/components/org-mark'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { organisation } from '@/lib/data'
import type { Role } from '@/lib/session-token'

export function SidebarContent({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <div className="flex items-center gap-3 px-1">
        <OrgMark className="size-9" inverted />
        <div className="leading-tight">
          <p className="text-sm font-medium text-sidebar-primary">{organisation.unit}</p>
          <p className="text-xs text-sidebar-foreground/70">Avtalsår {organisation.contractYear}</p>
        </div>
      </div>

      <SidebarNav role={role} onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
          Er kontakt
        </p>
        <div className="leading-tight">
          <p className="text-sm font-medium text-sidebar-primary">{organisation.accountManager.name}</p>
          <p className="text-xs text-sidebar-foreground/70">Key Account Manager</p>
        </div>
        <div className="flex flex-col gap-1.5 text-xs">
          <a
            href={`mailto:${organisation.accountManager.email}`}
            className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
          >
            <Mail className="size-3.5" />
            <span className="truncate">{organisation.accountManager.email}</span>
          </a>
          <a
            href={`tel:${organisation.accountManager.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
          >
            <Phone className="size-3.5" />
            <span>{organisation.accountManager.phone}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:block">
      <SidebarContent role={role} />
    </aside>
  )
}
