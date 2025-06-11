import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Netlify
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Configuración para dispositivos móviles y cross-origin
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "*.clerk.accounts.dev *.clerk.dev *.clerk.com clerk-telemetry.com",
              "*.supabase.co *.supabase.io",
              "data: blob:",
              "connect-src 'self' *.clerk.accounts.dev *.clerk.dev *.clerk.com clerk-telemetry.com *.supabase.co *.supabase.io ws: wss:",
              "img-src 'self' data: blob: *.clerk.accounts.dev *.clerk.dev",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev *.clerk.dev",
              "style-src 'self' 'unsafe-inline'"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  // Configuración experimental para mejor compatibilidad móvil
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
};

export default nextConfig;
