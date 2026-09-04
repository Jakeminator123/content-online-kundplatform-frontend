'use client'

import { useActionState } from 'react'

export type TicketState = { error?: string; ticketId?: string } | undefined
export type TicketAction = (previous: TicketState, form: FormData) => Promise<TicketState>

export function TicketForm({ organizationId, action }: { organizationId: string; action: TicketAction }) {
  const [state, submit, pending] = useActionState(action, undefined)
  return (
    <form action={submit} className="grid gap-4 rounded-xl border bg-card p-5">
      <input type="hidden" name="organizationId" value={organizationId} />
      <h2 className="text-lg font-medium">Skapa ärende</h2>
      <p className="text-sm text-muted-foreground">Ärendet sparas i den lokala backendens minne. Det försvinner när backendservern startas om.</p>
      <label className="grid gap-1.5 text-sm">Kategori
        <select name="category" className="rounded-md border bg-background px-3 py-2">
          <option value="usage_data">Användningsstatistik</option>
          <option value="access">Tillgång till resurser</option>
          <option value="membership_change">Ändra användarbehörighet</option>
          <option value="other">Övrigt</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">Rubrik
        <input name="title" required minLength={3} maxLength={120} className="rounded-md border bg-background px-3 py-2" />
      </label>
      <label className="grid gap-1.5 text-sm">Beskrivning
        <textarea name="description" required minLength={3} maxLength={2000} rows={3} className="rounded-md border bg-background px-3 py-2" />
      </label>
      {state?.error ? <p role="alert" className="text-sm text-destructive">{state.error}</p> : null}
      {state?.ticketId ? <p role="status" className="text-sm text-primary">Ärendet är sparat: {state.ticketId}</p> : null}
      <button disabled={pending} className="justify-self-start rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
        {pending ? 'Sparar…' : 'Skapa ärende'}
      </button>
    </form>
  )
}
