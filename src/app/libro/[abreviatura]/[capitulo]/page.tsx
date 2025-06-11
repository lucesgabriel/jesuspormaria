import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { VerseDisplay } from '@/components/biblia/verse-display'
import { ChapterGrid } from '@/components/biblia/chapter-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
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
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/libros" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Libros</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/libro/${book.abreviatura}`}>
                {book.nombre}
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">
              Capítulo {chapterNumber}
            </span>
          </div>

          {/* Chapter Navigation */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-4">
                <ChapterGrid 
                  book={book} 
                  selectedChapter={chapterNumber}
                  linkMode={true} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Verses */}
          <div className="max-w-4xl mx-auto">
            <VerseDisplay 
              verses={verses}
              book={book}
              chapter={chapter}
            />
          </div>
        </div>
      </main>
    </>
  )
} 