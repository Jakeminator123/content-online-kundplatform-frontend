import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Online · Personalportal',
  description: 'Content Onlines personalportal för tilldelade kunder, användning och ärenden.',
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return children
}
