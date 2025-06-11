'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Smartphone, Wifi, WifiOff, AlertTriangle } from 'lucide-react'

interface MobileErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
  errorType: 'network' | 'rsc' | 'mobile' | 'csp' | 'worker' | 'general'
}

export class MobileErrorBoundary extends React.Component<
  MobileErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      errorMessage: '', 
      errorType: 'general' 
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('Error capturado por MobileErrorBoundary:', error)
    
    // Detectar tipos específicos de errores
    const errorMessage = error.message.toLowerCase()
    
    let errorType: ErrorBoundaryState['errorType'] = 'general'
    let friendlyMessage = 'Ha ocurrido un error inesperado'
    
    // Errores específicos de CSP
    if (errorMessage.includes('content security policy') || errorMessage.includes('csp')) {
      errorType = 'csp'
      friendlyMessage = 'Error de política de seguridad'
    }
    // Errores de workers/blob
    else if (errorMessage.includes('worker') || errorMessage.includes('blob:')) {
      errorType = 'worker'
      friendlyMessage = 'Error de procesamiento en segundo plano'
    }
    // Errores de RSC payload
    else if (errorMessage.includes('rsc payload') || errorMessage.includes('failed to fetch')) {
      errorType = 'rsc'
      friendlyMessage = 'Error de conexión al servidor'
    }
    // Errores de red
    else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connect')) {
      errorType = 'network'
      friendlyMessage = 'Error de conexión de red'
    }
    // Errores específicos de móviles
    else if (
      errorMessage.includes('touch') ||
      errorMessage.includes('viewport') ||
      errorMessage.includes('orientation') ||
      errorMessage.includes('mobile')
    ) {
      errorType = 'mobile'
      friendlyMessage = 'Error de compatibilidad móvil'
    }

    return {
      hasError: true,
      errorMessage: friendlyMessage,
      errorType
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MobileErrorBoundary - Error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })
    
    // Reportar información del dispositivo si está disponible
    if (typeof window !== 'undefined') {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: 'connection' in navigator ? (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown' : 'unknown',
        online: navigator.onLine,
        url: window.location.href,
        referrer: document.referrer,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches
      }
      
      console.log('Device info when error occurred:', deviceInfo)
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '', errorType: 'general' })
    
    if (typeof window !== 'undefined') {
      // Limpiar cache del navegador si es posible
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      // Limpiar localStorage problemático
      try {
        localStorage.removeItem('clerk-db')
        sessionStorage.clear()
      } catch (e) {
        console.log('No se pudo limpiar el storage:', e)
      }
      
      // Recargar la página
      window.location.reload()
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '', errorType: 'general' })
  }

  clearBrowserData = () => {
    if (typeof window !== 'undefined') {
      try {
        // Limpiar todos los datos del navegador
        localStorage.clear()
        sessionStorage.clear()
        
        // Limpiar cookies de Clerk
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Limpiar cache si es posible
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name))
          })
        }
        
        // Recargar después de limpiar
        setTimeout(() => window.location.reload(), 1000)
      } catch (e) {
        console.error('Error limpiando datos del navegador:', e)
        window.location.reload()
      }
    }
  }

  getIcon = () => {
    switch (this.state.errorType) {
      case 'network':
      case 'rsc':
        return <WifiOff className="h-16 w-16 text-muted-foreground" />
      case 'mobile':
        return <Smartphone className="h-16 w-16 text-muted-foreground" />
      case 'csp':
      case 'worker':
        return <AlertTriangle className="h-16 w-16 text-muted-foreground" />
      default:
        return <RefreshCw className="h-16 w-16 text-muted-foreground" />
    }
  }

  getTroubleshootingTips = () => {
    switch (this.state.errorType) {
      case 'csp':
      case 'worker':
        return [
          '• Actualizar la página para aplicar nuevas políticas',
          '• Limpiar datos del navegador',
          '• Desactivar extensiones del navegador',
          '• Usar modo incógnito temporalmente'
        ]
      case 'network':
      case 'rsc':
        return [
          '• Verificar tu conexión a internet',
          '• Intentar cambiar de WiFi a datos móviles',
          '• Desactivar VPN si está activa',
          '• Esperar unos segundos y reintentar'
        ]
      case 'mobile':
        return [
          '• Rotar tu dispositivo',
          '• Actualizar tu navegador',
          '• Limpiar la caché del navegador',
          '• Usar el navegador en modo incógnito'
        ]
      default:
        return [
          '• Actualizar la página',
          '• Cerrar y abrir el navegador',
          '• Reiniciar la aplicación',
          '• Contactar soporte si persiste'
        ]
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              {this.getIcon()}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {this.state.errorMessage}
              </h1>
              <p className="text-muted-foreground">
                {this.state.errorType === 'csp' && 'Problema con políticas de seguridad del navegador.'}
                {this.state.errorType === 'worker' && 'Error en procesamiento de fondo.'}
                {this.state.errorType === 'rsc' && 'Problema de comunicación con el servidor.'}
                {this.state.errorType === 'network' && 'Revisa tu conexión a internet.'}
                {this.state.errorType === 'mobile' && 'Problema de visualización en tu dispositivo.'}
                {this.state.errorType === 'general' && 'Algo salió mal, pero lo podemos arreglar.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
                
                <Button 
                  onClick={this.handleReload} 
                  className="flex-1"
                >
                  <Wifi className="mr-2 h-4 w-4" />
                  Recargar
                </Button>
              </div>
              
              {(this.state.errorType === 'csp' || this.state.errorType === 'worker') && (
                <Button 
                  onClick={this.clearBrowserData} 
                  variant="destructive"
                  className="w-full"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Limpiar Datos del Navegador
                </Button>
              )}
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Si el problema persiste:</p>
                <ul className="text-left space-y-1">
                  {this.getTroubleshootingTips().map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-xs text-left bg-muted p-2 rounded">
                <summary className="cursor-pointer font-medium">
                  Información técnica (desarrollo)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  Error Type: {this.state.errorType}{'\n'}
                  User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}{'\n'}
                  Online: {typeof window !== 'undefined' ? navigator.onLine : 'N/A'}{'\n'}
                  Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 