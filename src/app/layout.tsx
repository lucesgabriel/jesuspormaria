import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Metadata, Viewport } from 'next'
import { MobileErrorBoundary } from '@/components/ui/mobile-error-boundary'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://bibliajerusalen.netlify.app' 
    : 'http://localhost:3000'),
  title: 'Biblia Jerusalén Católica',
  description: 'Aplicación web para la lectura y búsqueda de la Biblia Jerusalén Católica con sistema de favoritos y notas personales.',
  keywords: 'biblia, católica, jerusalén, lectura, búsqueda, favoritos, notas',
  authors: [{ name: 'Biblia Jerusalén App' }],
  creator: 'Biblia Jerusalén App',
  publisher: 'Biblia Jerusalén App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Biblia Jerusalén'
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://bibliajerusalen.netlify.app',
    siteName: 'Biblia Jerusalén Católica',
    title: 'Biblia Jerusalén Católica',
    description: 'Lee y estudia la Biblia Jerusalén Católica con favoritos y notas personales',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Biblia Jerusalén Católica'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'Biblia Jerusalén Católica',
    description: 'Lee y estudia la Biblia Jerusalén Católica con favoritos y notas personales'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="apple-touch-fullscreen" content="yes" />
        </head>
        <body className="min-h-screen bg-background font-sans antialiased">
          <MobileErrorBoundary>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </MobileErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}
