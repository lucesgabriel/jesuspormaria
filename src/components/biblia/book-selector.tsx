'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search } from 'lucide-react'
import { getAllBooks, getBooksByTestament } from '@/lib/supabase/queries'
import type { Book } from '@/types/database.types'

interface BookSelectorProps {
  selectedTestament?: 'AT' | 'NT' | null
  showSearch?: boolean
  gridCols?: 2 | 3 | 4
}

export function BookSelector({ 
  selectedTestament = null, 
  showSearch = true,
  gridCols = 3 
}: BookSelectorProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [allBooks, setAllBooks] = useState<Book[]>([]) // Lista completa para contadores
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTestament, setActiveTestament] = useState<string | null>(selectedTestament)

  useEffect(() => {
    loadBooks()
  }, [activeTestament])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery])

  const loadBooks = async () => {
    try {
      setLoading(true)
      
      // Siempre cargar todos los libros para contadores
      const allBooksData = await getAllBooks()
      setAllBooks(allBooksData)
      
      // Cargar libros filtrados según el testamento activo
      let booksData: Book[]
      if (activeTestament) {
        booksData = await getBooksByTestament(activeTestament)
      } else {
        booksData = allBooksData
      }
      
      setBooks(booksData)
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books)
      return
    }

    const filtered = books.filter(book =>
      book.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.abreviatura.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredBooks(filtered)
  }

  const handleTestamentFilter = (testament: string | null) => {
    setActiveTestament(testament)
    setSearchQuery('')
  }

  const getGridColsClass = () => {
    switch (gridCols) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  const antiguoTestamentoCount = allBooks.filter(book => book.testamento === 'AT').length
  const nuevoTestamentoCount = allBooks.filter(book => book.testamento === 'NT').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-9 w-32 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
        <div className={`grid gap-4 ${getGridColsClass()}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Testament Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTestament === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleTestamentFilter(null)}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Todos los Libros
          <Badge variant="secondary" className="ml-1">
            {allBooks.length}
          </Badge>
        </Button>
        <Button
          variant={activeTestament === 'AT' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTestamentFilter('AT')}
          className="flex items-center gap-2"
        >
          Antiguo Testamento
          <Badge variant="secondary" className="ml-1">
            {antiguoTestamentoCount}
          </Badge>
        </Button>
        <Button
          variant={activeTestament === 'NT' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTestamentFilter('NT')}
          className="flex items-center gap-2"
        >
          Nuevo Testamento
          <Badge variant="secondary" className="ml-1">
            {nuevoTestamentoCount}
          </Badge>
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar libro por nombre o abreviatura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Books Grid */}
      <div className={`grid gap-4 ${getGridColsClass()}`}>
        {filteredBooks.map((book) => (
          <Card 
            key={book.id} 
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <Link href={`/libro/${book.abreviatura}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm leading-tight group-hover:text-primary transition-colors">
                      {book.nombre}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      {book.abreviatura}
                    </Badge>
                  </div>
                  <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {book.testamento}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron libros</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No hay libros que coincidan con "${searchQuery}"`
              : 'No hay libros disponibles en esta sección'
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}

      {/* Results Count */}
      {filteredBooks.length > 0 && searchQuery && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
} 