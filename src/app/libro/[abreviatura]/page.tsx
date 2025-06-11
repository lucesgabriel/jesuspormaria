import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ChapterGrid } from '@/components/biblia/chapter-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getBookByAbbreviation } from '@/lib/supabase/queries'

interface BookPageProps {
  params: Promise<{
    abreviatura: string
  }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { abreviatura } = await params
  const book = await getBookByAbbreviation(abreviatura)

  if (!book) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/libros" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Volver a libros</span>
              </Link>
            </Button>
          </div>

          {/* Book Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">
                {book.nombre}
              </h1>
              <Badge variant="outline" className="text-sm">
                {book.abreviatura}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {book.testamento}
            </p>
          </div>

          {/* Chapters Grid */}
          <div className="max-w-4xl mx-auto">
            <ChapterGrid book={book} linkMode={true} />
          </div>

          {/* Book Info */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Información del Libro</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">Testamento</div>
                    <div className="text-muted-foreground">{book.testamento}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">Abreviatura</div>
                    <div className="text-muted-foreground">{book.abreviatura}</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Selecciona un capítulo arriba para comenzar la lectura del libro {book.nombre}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}

// Generate static params for popular books
export async function generateStaticParams() {
  const popularBooks = [
    'Gn', 'Ex', 'Sal', 'Mt', 'Mc', 'Lc', 'Jn', 'Hch', 'Rm', 'Ap'
  ]
  
  return popularBooks.map((abreviatura) => ({
    abreviatura
  }))
} 