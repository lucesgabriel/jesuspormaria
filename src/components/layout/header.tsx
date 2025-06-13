'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Book, Search, Menu, Home, Heart } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Libros', href: '/libros', icon: Book },
    { name: 'Búsqueda', href: '/buscar', icon: Search },
    ...(isSignedIn ? [{ name: 'Favoritos', href: '/favoritos', icon: Heart }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-2 md:px-4 w-full overflow-x-hidden">
        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center space-x-2 min-w-0">
          <Book className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block truncate">Biblia Jerusalén</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-foreground/60 transition-colors hover:text-foreground/80"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end min-w-0">
          {/* Search Shortcut */}
          <div className="w-full max-w-xs md:w-40 lg:w-64 flex-1 md:flex-none min-w-0">
            <Button
              variant="outline"
              className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
              asChild
            >
              <Link href="/buscar" className="truncate">
                <Search className="mr-2 h-4 w-4" />
                Buscar en la Biblia...
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Link>
            </Button>
          </div>

          {/* User Authentication */}
          <div className="hidden md:flex items-center space-x-2">
            {isSignedIn ? (
              <div className="flex items-center space-x-2">
                <span className="hidden text-sm text-muted-foreground sm:inline-block">
                  Hola, {user?.firstName || 'Usuario'}
                </span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] max-w-xs p-0">
              {/* DialogTitle accesible para screen readers */}
              <span className="sr-only" role="heading" aria-level={1}>Menú de navegación</span>
              <div className="flex flex-col h-full">
                {/* Logo y título */}
                <div className="flex items-center gap-2 px-5 pt-5 pb-2 border-b">
                  <Book className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Biblia Jerusalén</span>
                </div>
                {/* Autenticación en móvil */}
                {!isSignedIn && (
                  <div className="flex flex-col gap-2 px-5 pt-4 pb-2 border-b">
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link href="/sign-in" onClick={() => setIsOpen(false)}>Iniciar sesión</Link>
                    </Button>
                    <Button size="sm" asChild className="w-full justify-start">
                      <Link href="/sign-up" onClick={() => setIsOpen(false)}>Registrarse</Link>
                    </Button>
                  </div>
                )}
                {/* Navegación */}
                <nav className="flex flex-col gap-1 px-2 py-4 flex-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium text-foreground/90 hover:bg-accent/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
                {/* Si está logueado, mostrar UserButton en el footer del sidebar */}
                {isSignedIn && (
                  <div className="flex items-center gap-2 px-5 py-3 border-t">
                    <UserButton 
                      appearance={{ elements: { avatarBox: "h-8 w-8" } }}
                      afterSignOutUrl="/"
                    />
                    <span className="text-sm text-muted-foreground">{user?.firstName || 'Usuario'}</span>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 