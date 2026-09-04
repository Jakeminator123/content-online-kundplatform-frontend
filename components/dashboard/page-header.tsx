export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-balance text-3xl font-semibold tracking-[-.04em] md:text-[38px]">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-pretty text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
