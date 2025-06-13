import type { NextConfig } from "next";
import path from "path";
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  // Configuración para Netlify
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Webpack configuration to handle path resolution for Netlify
  webpack: (config) => {
    // Add alias for path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/types': path.resolve(__dirname, 'src/types'),
    };
    
    return config;
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

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
});
