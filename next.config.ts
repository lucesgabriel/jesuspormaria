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
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev *.supabase.co data: blob:; img-src 'self' data: blob: *.clerk.accounts.dev;"
          }
        ]
      }
    ]
  },
  // Configuración experimental para mejor compatibilidad
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
