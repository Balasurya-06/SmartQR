import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartQR',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
