'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Share2, Check, Settings2, Minus, Plus, LayoutGrid, List } from 'lucide-react'
import { FavoriteNotes } from './favorite-notes'
import type { Verse, Book, Chapter } from '@/types/database.types'

interface ReadingSettings {
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  viewMode: 'cards' | 'continuous'
  spacing: 'tight' | 'comfortable' | 'relaxed'
  showNumbers: boolean
}

interface VerseDisplayProps {
  verses: Verse[]
  book: Book
  chapter: Chapter
  highlightText?: string
}

const defaultSettings: ReadingSettings = {
  fontSize: 'base',
  viewMode: 'cards',
  spacing: 'comfortable',
  showNumbers: true
}

export function VerseDisplay({ 
  verses, 
  book, 
  chapter, 
  highlightText 
}: VerseDisplayProps) {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<ReadingSettings>(defaultSettings)

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('reading-settings')
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      } catch {
        // Usar configuración por defecto si hay error
      }
    }
  }, [])

  // Guardar configuración en localStorage
  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('reading-settings', JSON.stringify(updatedSettings))
  }

  const copyToClipboard = async (verse: Verse) => {
    const text = `"${verse.texto}" - ${book.nombre} ${chapter.numero},${verse.numero} (Biblia Jerusalén)`
    
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
    const text = `"${verse.texto}" - ${book.nombre} ${chapter.numero},${verse.numero} (Biblia Jerusalén)`
    const url = `${window.location.origin}/libro/${book.abreviatura}/${chapter.numero}#v${verse.numero}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book.nombre} ${chapter.numero},${verse.numero}`,
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
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  // Clases CSS dinámicas basadas en configuración
  const getTextSizeClass = () => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm', 
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl'
    }
    return sizeMap[settings.fontSize]
  }

  const getSpacingClass = () => {
    const spacingMap = {
      tight: 'space-y-2',
      comfortable: 'space-y-4',
      relaxed: 'space-y-6'
    }
    return spacingMap[settings.spacing]
  }

  const getLineHeightClass = () => {
    const lineHeightMap = {
      xs: 'leading-tight',
      sm: 'leading-relaxed',
      base: 'leading-relaxed',
      lg: 'leading-relaxed', 
      xl: 'leading-loose',
      '2xl': 'leading-loose'
    }
    return lineHeightMap[settings.fontSize]
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
      {/* Header with Reading Controls */}
      <div className="space-y-4">
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

        {/* Reading Controls */}
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-2 reading-controls rounded-lg p-2 mx-auto max-w-fit">
          {/* Font Size Controls */}
          <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const
                const currentIndex = sizes.indexOf(settings.fontSize)
                if (currentIndex > 0) {
                  updateSettings({ fontSize: sizes[currentIndex - 1] })
                }
              }}
              disabled={settings.fontSize === 'xs'}
              className="h-8 w-8 p-0"
              title="Reducir tamaño de fuente"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-xs font-medium min-w-[3rem] text-center">
              {settings.fontSize.toUpperCase()}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const
                const currentIndex = sizes.indexOf(settings.fontSize)
                if (currentIndex < sizes.length - 1) {
                  updateSettings({ fontSize: sizes[currentIndex + 1] })
                }
              }}
              disabled={settings.fontSize === '2xl'}
              className="h-8 w-8 p-0"
              title="Aumentar tamaño de fuente"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={settings.viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateSettings({ viewMode: 'cards' })}
              className="h-8 px-3"
              title="Vista de tarjetas"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cards</span>
            </Button>
            
            <Button
              variant={settings.viewMode === 'continuous' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updateSettings({ viewMode: 'continuous' })}
              className="h-8 px-3"
              title="Vista continua"
            >
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Continua</span>
            </Button>
          </div>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
            title="Más opciones"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Advanced Settings Panel */}
        {showSettings && (
          <Card className="mx-auto max-w-md">
            <CardContent className="p-4 space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-3">Configuración de Lectura</h3>
              </div>

              {/* Spacing Control */}
              <div>
                <label className="text-sm font-medium mb-2 block">Espaciado</label>
                <div className="flex space-x-1">
                  {(['tight', 'comfortable', 'relaxed'] as const).map((spacing) => (
                    <Button
                      key={spacing}
                      variant={settings.spacing === spacing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings({ spacing })}
                      className="flex-1 text-xs"
                    >
                      {spacing === 'tight' ? 'Compacto' : 
                       spacing === 'comfortable' ? 'Normal' : 'Amplio'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Numbers Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mostrar números</span>
                <Button
                  variant={settings.showNumbers ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ showNumbers: !settings.showNumbers })}
                >
                  {settings.showNumbers ? 'Sí' : 'No'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Verses Content */}
      {settings.viewMode === 'cards' ? (
        /* Cards View */
        <div className={getSpacingClass()}>
          {verses.map((verse) => (
            <Card 
              key={verse.id} 
              id={`v${verse.numero}`}
              className="group verse-hover verse-transition hover:bg-accent/5"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  {/* Verse Number */}
                  {settings.showNumbers && (
                    <Badge 
                      variant="outline" 
                      className="flex-shrink-0 mt-1 text-xs font-medium min-w-[2rem] justify-center"
                    >
                      {verse.numero}
                    </Badge>
                  )}

                  {/* Verse Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`${getTextSizeClass()} ${getLineHeightClass()} bible-text bible-verse selectable-text`}>
                      {highlightText 
                        ? highlightTextInVerse(verse.texto, highlightText)
                        : verse.texto
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity md:space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(verse)}
                      className="h-9 w-9 p-0 md:h-8 md:w-8"
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
                      className="h-9 w-9 p-0 md:h-8 md:w-8"
                      title="Compartir versículo"
                    >
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Favorite Notes Section */}
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
      ) : (
        /* Continuous View */
        <Card>
          <CardContent className="p-6 md:p-8">
                         <div className={`${getTextSizeClass()} ${getLineHeightClass()} bible-text bible-verse continuous-reading selectable-text space-y-3`}>
              {verses.map((verse, index) => (
                <span key={verse.id} id={`v${verse.numero}`} className="inline">
                  {index > 0 && ' '}
                  {settings.showNumbers && (
                                         <sup className="text-primary font-semibold mr-1 cursor-pointer verse-number text-xs">
                      {verse.numero}
                    </sup>
                  )}
                  <span className="group relative">
                    {highlightText 
                      ? highlightTextInVerse(verse.texto, highlightText)
                      : verse.texto
                    }
                    {/* Hover Actions for Continuous View */}
                    <span className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(verse)}
                        className="h-6 w-6 p-0"
                        title="Copiar versículo"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <FavoriteNotes 
                        verseId={verse.id}
                        verseText={verse.texto}
                        bookName={book.nombre}
                        chapterNumber={chapter.numero}
                        verseNumber={verse.numero}
                        className="h-6 w-6 p-0"
                      />
                    </span>
                  </span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>
          {book.nombre} {chapter.numero} • {verses.length} versículo{verses.length !== 1 ? 's' : ''} • Biblia Jerusalén Católica
        </p>
      </div>
    </div>
  )
} 