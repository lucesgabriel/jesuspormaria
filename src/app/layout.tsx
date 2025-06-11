import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { MobileErrorBoundary } from '@/components/ui/mobile-error-boundary'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblia Jerusalén Católica",
  description: "Aplicación web para la lectura y búsqueda de la Biblia Jerusalén Católica",
  keywords: ["biblia", "católica", "jerusalén", "lectura", "búsqueda", "versículos"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Biblia Jerusalén"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png"
  },
  openGraph: {
    title: "Biblia Jerusalén Católica",
    description: "Aplicación web para la lectura y búsqueda de la Biblia Jerusalén Católica",
    type: "website",
    locale: "es_ES"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={inter.className}>
        <head>
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Biblia Jerusalén" />
          <meta name="msapplication-TileColor" content="#1a1a1a" />
          <meta name="msapplication-tap-highlight" content="no" />
        </head>
        <body className="antialiased">
          <MobileErrorBoundary>
            {children}
          </MobileErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
