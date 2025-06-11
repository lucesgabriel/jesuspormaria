import { notFound } from 'next/navigation'
import { VerseDisplay } from '@/components/biblia/verse-display'
import { ChapterGrid } from '@/components/biblia/chapter-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Hash } from 'lucide-react'
import Link from 'next/link'
import { 
  getBookByAbbreviation, 
  getChapterByBookAndNumber, 
  getVersesByChapterId 
} from '@/lib/supabase/queries'

interface ChapterPageProps {
  params: Promise<{
    abreviatura: string
    capitulo: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { abreviatura, capitulo } = await params
  const chapterNumber = parseInt(capitulo)

  if (isNaN(chapterNumber)) {
    notFound()
  }

  const book = await getBookByAbbreviation(abreviatura)
  
  if (!book) {
    notFound()
  }

  const chapter = await getChapterByBookAndNumber(book.id, chapterNumber)
  
  if (!chapter) {
    notFound()
  }

  const verses = await getVersesByChapterId(chapter.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center space-x-2 text-sm">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/libros" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Libros</span>
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/libro/${book.abreviatura}`} className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{book.nombre}</span>
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center space-x-1">
            <Hash className="h-3 w-3 text-primary" />
            <span className="font-medium">Capítulo {chapterNumber}</span>
          </div>
        </div>

        {/* Chapter Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {book.nombre} {chapterNumber}
            </h1>
            <Badge variant="outline" className="text-xs">
              {book.abreviatura} {chapterNumber}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {book.testamento} • {verses.length} versículos
          </p>
        </div>

        {/* Quick Chapter Navigation */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Navegación por Capítulos</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChapterGrid 
                book={book} 
                selectedChapter={chapterNumber}
                linkMode={true} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Chapter Content */}
        <div className="max-w-4xl mx-auto">
          <VerseDisplay 
            verses={verses}
            book={book}
            chapter={chapter}
          />
        </div>

        {/* Chapter Footer Info */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardContent className="text-center py-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-primary">Libro</div>
                  <div className="text-muted-foreground">{book.nombre}</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Capítulo</div>
                  <div className="text-muted-foreground">{chapterNumber}</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Versículos</div>
                  <div className="text-muted-foreground">{verses.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 