'use client'

import { useState } from 'react'
import { LogOut, Menu, ShieldCheck, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SidebarContent } from '@/components/dashboard/sidebar'
import { logoutAction } from '@/app/login/actions'
import type { User } from '@/lib/auth'

export function Topbar({ user, dateLabel }: { user: User; dateLabel: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background/85 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Öppna meny" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent role={user.role} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <p className="hidden text-sm text-muted-foreground sm:block">{dateLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className="hidden gap-1.5 font-normal text-muted-foreground sm:inline-flex"
        >
          {user.role === 'admin' ? (
            <ShieldCheck className="size-3" />
          ) : (
            <UserRound className="size-3" />
          )}
          {user.role === 'admin' ? 'Kundadministratör' : 'Läsare'}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Kontomeny"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="font-medium">{user.displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">{user.title}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem
                nativeButton
                render={<button type="submit" className="w-full" />}
                className="gap-2"
              >
                <LogOut className="size-4" />
                Logga ut
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
