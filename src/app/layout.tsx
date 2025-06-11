import type { Metadata } from "next";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" }
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Biblia Jerusalén"
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Biblia Jerusalén" />
          <meta name="msapplication-TileColor" content="#1a1a1a" />
          <meta name="theme-color" content="#1a1a1a" />
        </head>
        <body className={`${inter.className} antialiased dark`}>
          <MobileErrorBoundary>
            {children}
          </MobileErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
