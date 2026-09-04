import { cn } from '@/lib/utils'

export function OrgMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md font-mono text-[0.6em] font-semibold tracking-tight',
        inverted ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-primary text-primary-foreground',
        className,
      )}
    >
      KTH
    </span>
  )
}
