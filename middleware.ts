import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/perfil(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Crear respuesta con headers optimizados para móviles
  const response = NextResponse.next()
  
  // Headers básicos de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Headers específicos para dispositivos móviles
  response.headers.set('X-UA-Compatible', 'IE=edge')
  response.headers.set('X-Robots-Tag', 'index, follow')
  
  // Headers para PWA
  if (req.nextUrl.pathname === '/manifest.json') {
    response.headers.set('Content-Type', 'application/manifest+json')
    response.headers.set('Cache-Control', 'public, max-age=3600')
  }
  
  // Headers para dispositivos móviles y cross-origin
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  
  // Permitir conexiones desde la red local para desarrollo
  if (
    process.env.NODE_ENV === 'development' && 
    origin && 
    (origin.includes('172.28.48.1') || origin.includes('localhost'))
  ) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Headers específicos para RSC y dispositivos móviles
  if (process.env.NODE_ENV === 'development') {
    // Headers para mejorar RSC en desarrollo
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    // Headers específicos para RSC payload
    response.headers.set('X-Accel-Buffering', 'no')
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }
  
  // Headers para mejorar la experiencia móvil
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // CSP optimizado para RSC (React Server Components) y modo móvil
  const isDev = process.env.NODE_ENV === 'development'
  
  const csp = isDev 
    ? [
        // Modo desarrollo: más permisivo para evitar errores RSC
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "connect-src 'self' *.clerk.accounts.dev *.clerk.dev *.clerk.com clerk-telemetry.com *.supabase.co *.supabase.io ws: wss: http://localhost:* http://172.28.48.1:*",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com *.clerk.accounts.dev *.clerk.dev",
        "img-src 'self' data: blob: *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "font-src 'self' data: fonts.gstatic.com fonts.googleapis.com",
        "frame-src 'self' *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "worker-src 'self' blob:",
        "media-src 'self' blob: data:"
      ].join('; ')
    : [
        // Modo producción: más restrictivo pero funcional
        "default-src 'self'",
        "script-src 'self' blob: *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "connect-src 'self' *.clerk.accounts.dev *.clerk.dev *.clerk.com clerk-telemetry.com *.supabase.co *.supabase.io ws: wss:",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com *.clerk.accounts.dev *.clerk.dev",
        "img-src 'self' data: blob: *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "font-src 'self' data: fonts.gstatic.com fonts.googleapis.com",
        "frame-src 'self' *.clerk.accounts.dev *.clerk.dev *.clerk.com",
        "worker-src 'self' blob:",
        "media-src 'self' blob: data:"
      ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Verificar si es una ruta protegida
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 