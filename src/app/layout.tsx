import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblia Jerusalén Católica",
  description: "Aplicación web para la lectura y búsqueda de la Biblia Jerusalén Católica",
  keywords: ["biblia", "católica", "jerusalén", "lectura", "búsqueda", "versículos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${inter.className} antialiased dark`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
