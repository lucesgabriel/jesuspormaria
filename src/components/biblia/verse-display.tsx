'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Share2, Check } from 'lucide-react'
import { FavoriteNotes } from './favorite-notes'
import type { Verse, Book, Chapter } from '@/types/database.types'

interface VerseDisplayProps {
  verses: Verse[]
  book: Book
  chapter: Chapter
  highlightText?: string
}

export function VerseDisplay({ 
  verses, 
  book, 
  chapter, 
  highlightText 
}: VerseDisplayProps) {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null)

  const copyToClipboard = async (verse: Verse) => {
    const text = `"${verse.texto}" - ${book.nombre} ${chapter.numero}:${verse.numero} (Biblia Jerusalén)`
    
    // Check if navigator.clipboard is available
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedVerse(verse.id)
        setTimeout(() => setCopiedVerse(null), 2000)
        return
      } catch {
        // Fall through to fallback method
      }
    }
    
    // Fallback for older browsers or non-secure contexts
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedVerse(verse.id)
      setTimeout(() => setCopiedVerse(null), 2000)
    } catch {
      console.warn('Could not copy to clipboard')
    }
  }

  const shareVerse = async (verse: Verse) => {
    const text = `"${verse.texto}" - ${book.nombre} ${chapter.numero}:${verse.numero} (Biblia Jerusalén)`
    const url = `${window.location.origin}/libro/${book.abreviatura}/${chapter.numero}#v${verse.numero}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book.nombre} ${chapter.numero}:${verse.numero}`,
          text: text,
          url: url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        copyToClipboard(verse)
      }
    } else {
      copyToClipboard(verse)
    }
  }



  const highlightTextInVerse = (text: string, highlight: string) => {
    if (!highlight) return text
    
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === highlight.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  if (verses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No hay versículos disponibles</h3>
            <p className="text-muted-foreground">
              Este capítulo no tiene versículos registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          {book.nombre} {chapter.numero}
        </h1>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline">
            {book.abreviatura} {chapter.numero}
          </Badge>
          <Badge variant="secondary">
            {verses.length} versículo{verses.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {book.testamento}
        </p>
      </div>

      {/* Verses */}
      <div className="space-y-4">
        {verses.map((verse) => (
          <Card 
            key={verse.id} 
            id={`v${verse.numero}`}
            className="group hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Verse Number */}
                <Badge 
                  variant="outline" 
                  className="flex-shrink-0 mt-1 text-xs font-medium min-w-[2rem] justify-center"
                >
                  {verse.numero}
                </Badge>

                {/* Verse Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-base leading-relaxed">
                    {highlightText 
                      ? highlightTextInVerse(verse.texto, highlightText)
                      : verse.texto
                    }
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(verse)}
                    className="h-8 w-8 p-0"
                    title="Copiar versículo"
                  >
                    {copiedVerse === verse.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareVerse(verse)}
                    className="h-8 w-8 p-0"
                    title="Compartir versículo"
                  >
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Favorite Notes Section - Always Visible for Auth Users */}
              <div className="mt-4 flex justify-end">
                <FavoriteNotes 
                  verseId={verse.id}
                  verseText={verse.texto}
                  bookName={book.nombre}
                  chapterNumber={chapter.numero}
                  verseNumber={verse.numero}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>
          {book.nombre} {chapter.numero} • {verses.length} versículo{verses.length !== 1 ? 's' : ''} • Biblia Jerusalén Católica
        </p>
      </div>
    </div>
  )
} 