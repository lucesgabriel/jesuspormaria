const path = require("path");
const withPWA = require("next-pwa")({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/(.*\.)?clerk\.com\/.*$/i,
      handler: 'NetworkOnly',
      method: 'GET',
    },
    {
      urlPattern: /\/sign-in|\/sign-up|\/api\/auth\/.*/,
      handler: 'NetworkOnly',
      method: 'GET',
    },
  ],
});

module.exports = withPWA({
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/types': path.resolve(__dirname, 'src/types'),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }
        ]
      }
    ]
  },
  experimental: {
    esmExternals: true
  },
  serverExternalPackages: ['@supabase/supabase-js']
});
