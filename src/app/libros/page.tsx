import { BookSelector } from '@/components/biblia/book-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function LibrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Libros de la Biblia
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora los 73 libros de la Biblia Jerusalén Católica, organizados por testamento. 
              Haz clic en cualquier libro para comenzar tu lectura.
            </p>
          </div>

          {/* Book Selector */}
          <div className="max-w-6xl mx-auto">
            <BookSelector showSearch={true} gridCols={4} />
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Acerca de la Biblia Jerusalén</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  La Biblia de Jerusalén es una traducción católica de la Biblia realizada por la 
                  Escuela Bíblica y Arqueológica Francesa de Jerusalén. Es reconocida por su 
                  rigor científico y su fidelidad a los textos originales.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">46 libros</div>
                    <div className="text-muted-foreground">Antiguo Testamento</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">27 libros</div>
                    <div className="text-muted-foreground">Nuevo Testamento</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">34,957</div>
                    <div className="text-muted-foreground">Versículos totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
} 