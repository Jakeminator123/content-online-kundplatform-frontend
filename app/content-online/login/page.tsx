import { redirect } from 'next/navigation'

export default function OperatorLoginPage() {
  // Internal auth belongs to the platform, never the customer demo session.
  redirect('https://content-online-platform.vercel.app/admin/login')
}
