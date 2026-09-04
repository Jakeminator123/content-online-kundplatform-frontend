'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  FolderLock,
  LayoutGrid,
  Newspaper,
  Settings2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/session-token'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
  badge?: string
}

const items: NavItem[] = [
  { href: '/', label: 'Överblick', icon: LayoutGrid },
  { href: '/anvandning', label: 'Nyttjande', icon: BarChart3 },
  { href: '/efterfragan', label: 'Efterfrågan', icon: Sparkles, badge: '5' },
  { href: '/nyheter', label: 'Från förlagen', icon: Newspaper },
  { href: '/dokument', label: 'Dokument', icon: FolderLock },
  { href: '/kundservice', label: 'Kundservice & källdata', icon: Settings2 },
  { href: '/admin', label: 'KTH:s portaladministration', icon: Settings2, adminOnly: true },
]

export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Huvudnavigation" className="flex flex-col gap-1">
      {items
        .filter((item) => !item.adminOnly || role === 'admin')
        .map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="size-4 shrink-0 opacity-80" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-signal px-1.5 py-px font-mono text-[10px] font-medium text-signal-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
    </nav>
  )
}
