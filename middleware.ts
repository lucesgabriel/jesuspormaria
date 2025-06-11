import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/perfil(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Agregar headers para dispositivos móviles
  const response = NextResponse.next()
  
  // Headers para PWA y dispositivos móviles
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Headers específicos para PWA
  if (req.nextUrl.pathname === '/manifest.json') {
    response.headers.set('Content-Type', 'application/manifest+json')
    response.headers.set('Cache-Control', 'public, max-age=3600')
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