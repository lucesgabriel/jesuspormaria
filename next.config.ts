import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Netlify
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  // Configuración para mejor compatibilidad
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
