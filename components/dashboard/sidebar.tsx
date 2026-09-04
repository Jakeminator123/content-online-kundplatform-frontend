import Link from 'next/link'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { OrgMark } from '@/components/org-mark'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { organisation } from '@/lib/data'
import type { Role } from '@/lib/session-token'

export function SidebarContent({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  return <div className="flex h-full flex-col gap-7 px-4 py-7">
    <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 text-sidebar-primary"><span className="grid size-8 place-items-center rounded-lg border border-white/20 text-xl font-semibold text-[#95dbc9]">c.</span><div className="text-base font-semibold tracking-tight">Content Online<p className="mt-0.5 text-[9px] font-normal uppercase tracking-[.18em] text-sidebar-foreground/60">Kundportal</p></div></Link>
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[.025] p-3"><OrgMark className="size-9" inverted /><div><p className="text-xs font-medium text-sidebar-primary">{organisation.unit}</p><p className="mt-1 text-[10px] text-sidebar-foreground/60">Avtalsår {organisation.contractYear} · demo</p></div></div>
    <div><p className="mb-3 px-3 text-[9px] uppercase tracking-[.18em] text-sidebar-foreground/45">ER ARBETSYTA</p><SidebarNav role={role} onNavigate={onNavigate} /></div>
    <div className="mt-auto rounded-xl border border-white/10 bg-white/[.03] p-4"><MessageCircle className="mb-3 size-5 text-[#95dbc9]" /><p className="text-sm font-medium text-sidebar-primary">Vi hjälper er vidare.</p><p className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/65">Frågor om portföljen, tillgång eller en kommande förnyelse?</p><Link onClick={onNavigate} href="/kundservice" className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-sidebar-primary">Till kundservice<ArrowUpRight className="size-3.5" /></Link></div>
    <a href="https://content-online-platform.vercel.app/demo" className="px-2 text-[10px] text-sidebar-foreground/50 hover:text-white">Content Online · separat admin-demo ↗</a>
  </div>
}
export function Sidebar({ role }: { role: Role }) {
  return <aside className="sticky top-0 hidden h-svh w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:block"><SidebarContent role={role} /></aside>
}
