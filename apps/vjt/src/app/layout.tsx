import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RetainAI - Virtual Job Tryout',
  description: 'Complete the assessment to continue your application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

