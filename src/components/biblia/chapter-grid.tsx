'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { getChaptersByBookId } from '@/lib/supabase/queries'
import type { Book, Chapter } from '@/types/database.types'

interface ChapterGridProps {
  book: Book
  selectedChapter?: number
  onChapterSelect?: (chapter: Chapter) => void
  linkMode?: boolean
}

export function ChapterGrid({ 
  book, 
  selectedChapter, 
  onChapterSelect,
  linkMode = true 
}: ChapterGridProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChapters()
  }, [book.id])

  const loadChapters = async () => {
    try {
      setLoading(true)
      const chaptersData = await getChaptersByBookId(book.id)
      setChapters(chaptersData)
    } catch (error) {
      console.error('Error loading chapters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChapterClick = (chapter: Chapter) => {
    if (onChapterSelect) {
      onChapterSelect(chapter)
    }
  }

  const getNextChapter = () => {
    if (!selectedChapter || selectedChapter >= chapters.length) return null
    return chapters.find(ch => ch.numero === selectedChapter + 1)
  }

  const getPrevChapter = () => {
    if (!selectedChapter || selectedChapter <= 1) return null
    return chapters.find(ch => ch.numero === selectedChapter - 1)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-5 w-20 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{book.nombre}</h2>
          <Badge variant="outline" className="text-xs">
            {book.abreviatura}
          </Badge>
        </div>
        <Badge variant="secondary">
          {chapters.length} capítulo{chapters.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Navigation for selected chapter */}
      {selectedChapter && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                     <Button
             variant="outline"
             size="sm"
             disabled={!getPrevChapter()}
             asChild={linkMode && !!getPrevChapter()}
           >
            {linkMode && getPrevChapter() ? (
              <Link href={`/libro/${book.abreviatura}/${getPrevChapter()?.numero}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Capítulo {getPrevChapter()?.numero}
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Capítulo {getPrevChapter()?.numero || ''}
              </span>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Capítulo actual</p>
            <p className="font-semibold">{selectedChapter}</p>
          </div>

                     <Button
             variant="outline"
             size="sm"
             disabled={!getNextChapter()}
             asChild={linkMode && !!getNextChapter()}
           >
            {linkMode && getNextChapter() ? (
              <Link href={`/libro/${book.abreviatura}/${getNextChapter()?.numero}`}>
                Capítulo {getNextChapter()?.numero}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <span>
                Capítulo {getNextChapter()?.numero || ''}
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Chapters Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {chapters.map((chapter) => {
          const isSelected = selectedChapter === chapter.numero
          
          if (linkMode) {
            return (
              <Button
                key={chapter.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-10 font-medium"
                asChild
              >
                <Link href={`/libro/${book.abreviatura}/${chapter.numero}`}>
                  {chapter.numero}
                </Link>
              </Button>
            )
          }

          return (
            <Button
              key={chapter.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="h-10 font-medium"
              onClick={() => handleChapterClick(chapter)}
            >
              {chapter.numero}
            </Button>
          )
        })}
      </div>

      {/* Empty State */}
      {chapters.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay capítulos disponibles</h3>
            <p className="text-muted-foreground text-center">
              Este libro no tiene capítulos registrados en la base de datos.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      {chapters.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          <p>{book.testamento} • {chapters.length} capítulo{chapters.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
} 