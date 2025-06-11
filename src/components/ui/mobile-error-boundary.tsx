'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Smartphone } from 'lucide-react'

interface MobileErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
}

export class MobileErrorBoundary extends React.Component<
  MobileErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Detectar errores específicos de dispositivos móviles
    const isMobileError = 
      error.message.includes('touch') ||
      error.message.includes('viewport') ||
      error.message.includes('orientation') ||
      error.message.includes('mobile') ||
      error.message.includes('touch-action')

    return {
      hasError: true,
      errorMessage: isMobileError 
        ? 'Error de compatibilidad móvil detectado'
        : 'Ha ocurrido un error inesperado'
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mobile Error Boundary caught an error:', error, errorInfo)
    
    // Reportar errores específicos de móviles
    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      
      if (isMobile) {
        console.log('Error occurred on mobile device:', {
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          error: error.message
        })
      }
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' })
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <Smartphone className="h-16 w-16 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {this.state.errorMessage}
              </h1>
              <p className="text-muted-foreground">
                Parece que hay un problema con la visualización en tu dispositivo.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={this.handleReload} 
                className="w-full"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Si el problema persiste, intenta:</p>
                <ul className="text-left space-y-1">
                  <li>• Rotar tu dispositivo</li>
                  <li>• Actualizar tu navegador</li>
                  <li>• Limpiar la caché del navegador</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 