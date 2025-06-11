'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { addFavorite, removeFavorite, isVerseFavorite } from '@/lib/supabase/queries'

interface FavoriteButtonProps {
  verseId: number
  className?: string
  showText?: boolean
}

export function FavoriteButton({ verseId, className, showText = false }: FavoriteButtonProps) {
  const { user, isSignedIn } = useUser()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Cargar estado inicial de favorito
  useEffect(() => {
    async function checkFavoriteStatus() {
      if (!isSignedIn || !user?.id) return

      try {
        const favorite = await isVerseFavorite(user.id, verseId)
        setIsFavorite(favorite)
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [verseId, user?.id, isSignedIn])

  const handleToggleFavorite = async () => {
    if (!isSignedIn || !user?.id) {
      // TODO: Mostrar modal de registro/login
      return
    }

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isFavorite) {
        await removeFavorite(user.id, verseId)
        setIsFavorite(false)
      } else {
        await addFavorite(user.id, verseId)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "h-8 transition-all duration-200",
        showText ? "px-3" : "w-8 p-0",
        isAnimating && "scale-110",
        className
      )}
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          isFavorite 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground hover:text-red-500",
          isAnimating && "scale-125"
        )}
      />
      {showText && (
        <span className="ml-1 text-xs">
          {isFavorite ? "Favorito" : "Favorito"}
        </span>
      )}
    </Button>
  )
} 