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