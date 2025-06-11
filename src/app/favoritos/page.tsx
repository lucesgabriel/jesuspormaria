'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Search, FileDown, Trash2 } from 'lucide-react'
import { getUserFavorites, removeFavorite } from '@/lib/supabase/queries'
import type { FavoriteWithVerse } from '@/types/database.types'

export default function FavoritesPage() {
  const { user, isSignedIn } = useUser()
  const [favorites, setFavorites] = useState<FavoriteWithVerse[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteWithVerse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const userFavorites = await getUserFavorites(user.id)
      setFavorites(userFavorites)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      setIsLoading(false)
      return
    }

    loadFavorites()
  }, [user?.id, isSignedIn, loadFavorites])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredFavorites(favorites)
      return
    }

    const filtered = favorites.filter(fav => 
      fav.verse?.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fav.verse?.chapter?.book?.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredFavorites(filtered)
  }, [searchQuery, favorites])

  const handleRemoveFavorite = async (verseId: number) => {
    if (!user?.id) return

    try {
      await removeFavorite(user.id, verseId)
      setFavorites(prev => prev.filter(fav => fav.verse_id !== verseId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const handleExportFavorites = () => {
    const text = filteredFavorites.map(fav => {
      const verse = fav.verse
      const chapter = verse?.chapter
      const book = chapter?.book
      return `'${verse?.texto}' - ${book?.nombre} ${chapter?.numero}:${verse?.numero}`
    }).join('\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favoritos-biblia.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Tus Versículos Favoritos</h1>
          <p className="text-muted-foreground mb-8">
            Inicia sesión para guardar y gestionar tus versículos favoritos
          </p>
          <Button asChild>
            <Link href="/sign-in">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Favoritos</h1>
          <p className="text-muted-foreground">
            {favorites.length} versículo{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar en favoritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* Exportar */}
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={handleExportFavorites}
              className="flex items-center space-x-2"
            >
              <FileDown className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando favoritos...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && favorites.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Aún no tienes favoritos</h3>
            <p className="text-muted-foreground mb-6">
              Comienza a guardar versículos que te inspiren marcándolos con el corazón
            </p>
            <Button asChild>
              <Link href="/">Explorar la Biblia</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Favorites List */}
      {!isLoading && filteredFavorites.length > 0 && (
        <div className="space-y-4">
          {filteredFavorites.map((favorite) => {
            const verse = favorite.verse
            const chapter = verse?.chapter
            const book = chapter?.book

            return (
              <Card key={favorite.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {book?.abreviatura} {chapter?.numero}:{verse?.numero}
                      </Badge>
                      <CardTitle className="text-lg">{book?.nombre}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => verse?.id && handleRemoveFavorite(verse.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed mb-4">
                    {verse?.texto}
                  </p>
                  {favorite.notes && (
                    <div className="bg-muted/50 rounded-md p-3">
                      <p className="text-sm text-muted-foreground italic">
                        Nota: {favorite.notes}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                    <span>
                      Guardado: {new Date(favorite.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="link" size="sm" asChild>
                      <a href={`/libro/${book?.abreviatura}/${chapter?.numero}#v${verse?.numero}`}>
                        Ver en contexto →
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchQuery && filteredFavorites.length === 0 && favorites.length > 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Sin resultados</h3>
            <p className="text-muted-foreground">
              No se encontraron favoritos que coincidan con &quot;{searchQuery}&quot;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 