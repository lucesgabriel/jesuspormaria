import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Netlify
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Headers básicos (CSP se maneja en middleware.ts)
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
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ]
  },
  // Configuración experimental para mejor compatibilidad móvil
  experimental: {
    esmExternals: true
  },
  // Configuración específica para evitar errores RSC en móviles
  serverExternalPackages: ['@supabase/supabase-js']
};

export default nextConfig;
