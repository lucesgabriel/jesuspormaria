'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BookOpen, Search, BarChart3, Heart } from 'lucide-react'

export default function Home() {
  const stats = {
    books: 73,
    chapters: 1328,
    verses: 34957
  }

  const popularBooks = [
    { name: 'Génesis', abbreviation: 'Gn' },
    { name: 'Salmos', abbreviation: 'Sal' },
    { name: 'Mateo', abbreviation: 'Mt' },
    { name: 'Juan', abbreviation: 'Jn' },
    { name: 'Romanos', abbreviation: 'Rm' },
    { name: 'Apocalipsis', abbreviation: 'Ap' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Biblia Jerusalén Católica
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explora las Sagradas Escrituras con una experiencia moderna de lectura y búsqueda. 
                Descubre la Palabra de Dios de manera intuitiva y accesible.
              </p>
            </div>

            {/* Quick Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar versículos, referencias..."
                  className="pl-9 h-12 text-base"
                  onClick={() => window.location.href = '/buscar'}
                  readOnly
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stats.books}</div>
                <div className="text-sm text-muted-foreground">Libros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stats.chapters}</div>
                <div className="text-sm text-muted-foreground">Capítulos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stats.verses}</div>
                <div className="text-sm text-muted-foreground">Versículos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Explorar Libros</CardTitle>
                <CardDescription>
                  Navega por los 73 libros de la Biblia organizados por testamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/libros">Ver todos los libros</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Búsqueda Avanzada</CardTitle>
                <CardDescription>
                  Encuentra versículos específicos por texto o referencia bíblica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/buscar">Buscar en la Biblia</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Versículo del Día</CardTitle>
                <CardDescription>
                  Descubre un versículo inspirador seleccionado especialmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/#verso-del-dia">Ver versículo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Popular Books */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Libros Populares</h2>
              <p className="text-muted-foreground">
                Comienza tu lectura con algunos de los libros más leídos
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularBooks.map((book) => (
                <Card key={book.abbreviation} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <Link href={`/libro/${book.abbreviation}`}>
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {book.name}
                      </h3>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {book.abbreviation}
                      </Badge>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>



        {/* Features */}
        <section className="container mx-auto px-4 py-12 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold">Búsqueda Inteligente</h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra versículos por palabras clave o referencias exactas
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold">Navegación Intuitiva</h3>
                <p className="text-sm text-muted-foreground">
                  Explora libros y capítulos de manera rápida y sencilla
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold">Marcadores</h3>
                <p className="text-sm text-muted-foreground">
                  Guarda tus versículos favoritos para referencia futura
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold">Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Optimizado para cualquier dispositivo y tamaño de pantalla
                </p>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}
