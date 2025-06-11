'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Loader2, 
  BookOpen, 
  Hash, 
  Clock, 
  TrendingUp,
  X
} from 'lucide-react'
import { 
  searchVerses, 
  searchByReference, 
  getUserSearchHistory, 
  getPopularSearches 
} from '@/lib/supabase/queries'
import type { SearchResult, SearchSuggestion, SearchHistory } from '@/types/database.types'
// Configuración de búsqueda
const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  RESULTS_PER_PAGE: 20,
  MAX_SUGGESTIONS: 8
}

export default function BuscarPage() {
  // Estados principales
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  
  // Estados de UI
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Usuario autenticado
  const { user } = useUser()

  // Función para detectar si es una referencia bíblica
  const detectSearchType = useCallback((query: string): 'text' | 'reference' => {
    const referencePatterns = [
      /^\d*\s*[A-Za-z]+\s+\d+:\d+/,  // Juan 3:16
      /^\d*\s*[A-Za-z]+\s+\d+/,      // Juan 3
      /^[A-Za-z]+\s+\d+:\d+/,        // Jn 3:16
      /^[A-Za-z]+\s+\d+/             // Jn 3
    ]
    
    return referencePatterns.some(pattern => pattern.test(query.trim())) 
      ? 'reference' 
      : 'text'
  }, [])

  // Búsqueda con debounce
  const performSearch = useCallback(async (searchQuery: string, type?: 'text' | 'reference') => {
    if (!searchQuery || searchQuery.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      setResults([])
      setHasSearched(false)
      return
    }

    console.log('🔍 Iniciando búsqueda...')
    setIsSearching(true)
    setHasSearched(true)

    try {
      const detectedType = type || detectSearchType(searchQuery)
      console.log(`📊 Tipo de búsqueda detectado: ${detectedType}`)

      let searchResults: SearchResult[] = []

      if (detectedType === 'reference') {
        console.log('📖 Buscando por referencia bíblica...')
        searchResults = await searchByReference(searchQuery)
      } else {
        console.log('🔤 Buscando por texto...')
        searchResults = await searchVerses(searchQuery, user?.id)
      }

      setResults(searchResults)
      console.log(`✅ Búsqueda completada: ${searchResults.length} resultados`)

    } catch (error) {
      console.error('❌ Error en búsqueda:', error)
      console.error('❌ Error en la búsqueda')
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [user?.id, detectSearchType])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      }
    }, SEARCH_CONFIG.DEBOUNCE_DELAY)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  // Cargar historial y sugerencias al montar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('📚 Cargando datos iniciales...')
        
        // Cargar historial del usuario si está autenticado
        if (user?.id) {
          const history = await getUserSearchHistory(user.id, 5)
          setSearchHistory(history)
          console.log(`📜 Historial cargado: ${history.length} búsquedas`)
        }

        // Cargar búsquedas populares
        const popular = await getPopularSearches(SEARCH_CONFIG.MAX_SUGGESTIONS)
        setSuggestions(popular)
        console.log(`🔥 Sugerencias populares: ${popular.length}`)

      } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error)
        console.error('❌ Error cargando datos iniciales')
      }
    }

    loadInitialData()
  }, [user?.id])

  // Manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    performSearch(suggestion)
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    setShowSuggestions(false)
  }

  // Resaltar texto en resultados
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Búsqueda Inteligente
          </h1>
          <p className="text-lg text-muted-foreground">
                         Encuentra versículos por palabras clave o referencias específicas (ej: &quot;Juan 3:16&quot;, &quot;amor&quot;, &quot;esperanza&quot;)
          </p>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar versículos, referencias (ej: Juan 3:16)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSuggestions(e.target.value.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 pr-20 h-12 text-base"
              disabled={isSearching}
            />
            
            {/* Indicador de tipo de búsqueda */}
            {query && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <Badge variant="outline" className="text-xs">
                  {detectSearchType(query) === 'reference' ? (
                    <>
                      <BookOpen className="h-3 w-3 mr-1" />
                      Referencia
                    </>
                  ) : (
                    <>
                      <Hash className="h-3 w-3 mr-1" />
                      Texto
                    </>
                  )}
                </Badge>
              </div>
            )}

            {/* Botón limpiar */}
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Indicador de carga */}
            {isSearching && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>

          {/* Sugerencias */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <Card className="absolute z-10 w-full mt-2 shadow-lg">
              <CardContent className="p-0">
                {/* Historial del usuario */}
                {searchHistory.length > 0 && (
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Búsquedas recientes</span>
                    </div>
                    {searchHistory.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-muted-foreground"
                        onClick={() => handleSuggestionSelect(item.query)}
                      >
                        {item.query}
                      </button>
                    ))}
                  </div>
                )}

                {/* Búsquedas populares */}
                {suggestions.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Búsquedas populares</span>
                    </div>
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={index}
                        className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded text-muted-foreground"
                        onClick={() => handleSuggestionSelect(suggestion.query)}
                      >
                        <span>{suggestion.query}</span>
                        {suggestion.frequency && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({suggestion.frequency})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            {/* Header de resultados */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  Resultados {query && `para "${query}"`}
                </h2>
                {results.length > 0 && (
                  <Badge variant="secondary">
                    {results.length} versículo{results.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>

            {/* Lista de resultados */}
            {isSearching ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Buscando versículos...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((verse) => (
                  <Card key={verse.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {verse.book_name} {verse.chapter_number}:{verse.numero}
                        </CardTitle>
                        <Badge variant="outline">
                          {verse.book_abbreviation}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed">
                        {highlightText(verse.texto, query)}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 inline mr-1" />
                          {verse.book_name}, Capítulo {verse.chapter_number}
                        </div>
                        <Button variant="outline" size="sm">
                          Ver capítulo completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta con diferentes palabras clave o referencias bíblicas
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Ejemplos de búsqueda:</strong></p>
                                     <p>• Por referencia: &quot;Juan 3:16&quot;, &quot;Génesis 1:1&quot;, &quot;Sal 23&quot;</p>
                   <p>• Por texto: &quot;amor&quot;, &quot;esperanza&quot;, &quot;fe&quot;</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensaje inicial */}
        {!hasSearched && !isSearching && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Comienza tu búsqueda</h3>
            <p className="text-muted-foreground mb-6">
              Escribe cualquier palabra o referencia bíblica para encontrar versículos relevantes
            </p>
            
            {/* Ejemplos rápidos */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ejemplos populares:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Juan 3:16', 'Sal 23', 'amor', 'esperanza', 'fe'].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionSelect(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 