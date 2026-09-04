'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { startOperatorSession, endOperatorSession, requireOperator } from '@/lib/operator-auth'
import { BackendError, createLocalBackendClient, isLocalDemo, parseTicketInput } from '@/lib/backend-client'
import type { TicketState } from '@/components/backend/ticket-form'

export async function operatorDemoLogin() {
  if (!isLocalDemo()) redirect('/content-online/login')
  await startOperatorSession()
  redirect('/content-online')
}

export async function operatorLogout() {
  await endOperatorSession()
  redirect('/content-online/login')
}

export async function createOperatorTicket(_previous: TicketState, form: FormData): Promise<TicketState> {
  await requireOperator()
  const input = parseTicketInput(form)
  if (!input) return { error: 'Fyll i en giltig kategori, rubrik (3–120 tecken) och beskrivning (3–2 000 tecken).' }
  let ticketId: string
  try {
    const result = await createLocalBackendClient('operator').createTicket(String(form.get('organizationId') ?? ''), input)
    ticketId = result.ticket.id
  } catch (error) {
    return { error: error instanceof BackendError ? error.message : 'Ärendet kunde inte sparas.' }
  }
  revalidatePath('/content-online')
  revalidatePath('/kundservice')
  return { ticketId }
}
