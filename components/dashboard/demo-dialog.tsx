'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function DemoDialog({ open, title, eyebrow = 'KTH · visningsdemo', onClose, children }: {
  open: boolean; title: string; eyebrow?: string; onClose: () => void; children: React.ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (open && !element?.open) element?.showModal()
    if (!open && element?.open) element.close()
  }, [open])
  return <dialog ref={dialog} aria-label={title} onCancel={onClose} onClose={onClose} className="demo-dialog">
    <div className="flex items-start justify-between gap-5 border-b p-6 md:p-7">
      <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.17em] text-muted-foreground">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2></div>
      <button type="button" onClick={onClose} className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-accent" aria-label="Stäng förhandsvisning"><X className="size-4" /></button>
    </div>
    <div className="p-6 md:p-7">{children}</div>
  </dialog>
}
