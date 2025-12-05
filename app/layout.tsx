import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'

export const metadata: Metadata = {
  title: 'Product Catalog CMS',
  description: 'Educational product catalog demonstrating backend concepts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
