'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Smartphone, Wifi, WifiOff } from 'lucide-react'

interface MobileErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
  errorType: 'network' | 'rsc' | 'mobile' | 'general'
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
    
    // Errores de RSC payload
    if (errorMessage.includes('rsc payload') || errorMessage.includes('failed to fetch')) {
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
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        online: navigator.onLine,
        url: window.location.href,
        referrer: document.referrer
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
      
      // Recargar la página
      window.location.reload()
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '', errorType: 'general' })
  }

  getIcon = () => {
    switch (this.state.errorType) {
      case 'network':
      case 'rsc':
        return <WifiOff className="h-16 w-16 text-muted-foreground" />
      case 'mobile':
        return <Smartphone className="h-16 w-16 text-muted-foreground" />
      default:
        return <RefreshCw className="h-16 w-16 text-muted-foreground" />
    }
  }

  getTroubleshootingTips = () => {
    switch (this.state.errorType) {
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
                  Online: {typeof window !== 'undefined' ? navigator.onLine : 'N/A'}
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