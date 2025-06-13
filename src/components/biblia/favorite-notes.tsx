'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, StickyNote, Save, X, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { 
  addFavorite, 
  removeFavorite, 
  updateFavoriteNotes, 
  getFavoriteWithNotes,
  isVerseFavorite 
} from '@/lib/supabase/queries'
import type { UserFavorite } from '@/types/database.types'
import { cn } from '@/lib/utils'

interface FavoriteNotesProps {
  verseId: number
  verseText: string
  bookName: string
  chapterNumber: number
  verseNumber: number
  className?: string
}

export function FavoriteNotes({
  verseId,
  verseText,
  bookName,
  chapterNumber,
  verseNumber,
  className
}: FavoriteNotesProps) {
  const { user, isSignedIn } = useUser()
  const [isFavorite, setIsFavorite] = useState(false)
  const [notes, setNotes] = useState('')
  const [tempNotes, setTempNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [, setFavoriteData] = useState<UserFavorite | null>(null)

  useEffect(() => {
    if (isSignedIn && user?.id) {
      checkFavoriteStatus()
    }
  }, [isSignedIn, user?.id, verseId])

  const checkFavoriteStatus = async () => {
    if (!user?.id) return

    try {
      const isFav = await isVerseFavorite(user.id, verseId)
      setIsFavorite(isFav)

      if (isFav) {
        const favData = await getFavoriteWithNotes(user.id, verseId)
        setFavoriteData(favData)
        setNotes(favData?.notes || '')
        setTempNotes(favData?.notes || '')
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!isSignedIn) {
      // Mostrar mensaje para registrarse
      return
    }

    if (!user?.id) return

    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(user.id, verseId)
        setIsFavorite(false)
        setNotes('')
        setTempNotes('')
        setFavoriteData(null)
      } else {
        const newFavorite = await addFavorite(user.id, verseId)
        setIsFavorite(true)
        setFavoriteData(newFavorite)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNotes = async () => {
    if (!user?.id || !isFavorite) return

    setIsLoading(true)
    try {
      const updatedFavorite = await updateFavoriteNotes(user.id, verseId, tempNotes)
      setNotes(tempNotes)
      setFavoriteData(updatedFavorite)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogClose = () => {
    setTempNotes(notes) // Revertir cambios si se cancela
    setIsDialogOpen(false)
  }

  // Para usuarios no autenticados
  if (!isSignedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("opacity-50 cursor-not-allowed", className)}
        disabled
      >
        <Heart className="h-4 w-4 mr-2" />
        Inicia sesión para guardar favoritos
      </Button>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Botón de favorito */}
      <Button
        variant={isFavorite ? "default" : "outline"}
        size="sm"
        onClick={toggleFavorite}
        disabled={isLoading}
        className={cn(
          "transition-all duration-200",
          isFavorite && "bg-red-500 hover:bg-red-600 text-white"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Heart 
            className={cn(
              "h-4 w-4 mr-2 transition-transform",
              isFavorite ? "fill-current scale-110" : "scale-100"
            )} 
          />
        )}
        {isFavorite ? 'Favorito' : 'Agregar a favoritos'}
      </Button>

      {/* Botón de notas (solo si es favorito) */}
      {isFavorite && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => setIsDialogOpen(true)}
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Notas
              {notes && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 p-0 rounded-full text-xs"
                >
                  !
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-left">
                Notas del versículo
              </DialogTitle>
              <div className="text-sm text-muted-foreground text-left">
                {bookName} {chapterNumber},{verseNumber}
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                                 <p className="text-sm italic">
                   &ldquo;{verseText}&rdquo;
                 </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tus notas personales:
                </label>
                <Textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Escribe tus reflexiones, pensamientos o comentarios sobre este versículo..."
                  rows={4}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {tempNotes.length}/500 caracteres
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleDialogClose}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={saveNotes}
                disabled={isLoading || tempNotes.length > 500}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Guardar notas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 