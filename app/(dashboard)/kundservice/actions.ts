'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { BackendError, createLocalBackendClient, parseTicketInput } from '@/lib/backend-client'
import type { TicketState } from '@/components/backend/ticket-form'

export async function createCustomerTicket(_previous: TicketState, form: FormData): Promise<TicketState> {
  const user = await requireUser()
  const input = parseTicketInput(form)
  if (!input) return { error: 'Fyll i en giltig kategori, rubrik (3–120 tecken) och beskrivning (3–2 000 tecken).' }
  let ticketId: string
  try {
    const result = await createLocalBackendClient(user.role).createTicket(String(form.get('organizationId') ?? ''), input)
    ticketId = result.ticket.id
  } catch (error) {
    return { error: error instanceof BackendError ? error.message : 'Ärendet kunde inte sparas.' }
  }
  revalidatePath('/kundservice')
  revalidatePath('/content-online')
  return { ticketId }
}
