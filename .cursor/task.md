# Tareas para Desarrollo de Aplicación Biblia Jerusalén Católica

## Información del Proyecto
- **Stack**: Next.js 14+ (App Router), Clerk Authentication, Supabase
- **Base de datos existente**: 
  - Proyecto: `biblia-jerusalen-1976`
  - ID: `kudmehunkkskivuldvqk`
  - URL: `https://kudmehunkkskivuldvqk.supabase.co`
- **Tablas en Supabase**:
  - `books` (73 registros): id, nombre, testamento, abreviatura
  - `chapters` (1,328 registros): id, book_id, numero
  - `verses` (34,957 registros): id, chapter_id, numero, texto
- **IDE**: Cursor AI

## MCP Tools a Utilizar
1. **filesystem** - Para crear y gestionar archivos del proyecto
2. **desktop-commander** - Para ejecutar comandos de terminal
3. **supabase** - Para conectar con la base de datos existente
4. **github** - Para gestión de código (opcional)
5. **brave-search** o **perplexity-search** - Para buscar documentación cuando sea necesario

## Fase 1: Configuración Inicial del Proyecto

### Tarea 1.1: Crear proyecto Next.js
**MCP Tools**: `desktop-commander`, `filesystem`
```bash
# Usar desktop-commander para ejecutar:
npx create-next-app@latest biblia-jerusalen-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd biblia-jerusalen-app
```

### Tarea 1.2: Instalar dependencias necesarias
**MCP Tools**: `desktop-commander`
```bash
# Instalar Clerk, Supabase y utilidades adicionales
npm install @clerk/nextjs @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install -D @types/node
```

### Tarea 1.3: Configurar variables de entorno
**MCP Tools**: `filesystem`
- Crear archivo `.env.local` con:
```env
# Clerk (El agente debe obtener estas keys de Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase (Valores del proyecto existente)
NEXT_PUBLIC_SUPABASE_URL=https://kudmehunkkskivuldvqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[OBTENER DE SUPABASE DASHBOARD - API Keys]
SUPABASE_SERVICE_ROLE_KEY=[OBTENER DE SUPABASE DASHBOARD - service_role key]
SUPABASE_JWT_SECRET=avaIz589hKL7P/5v/1Nadonjla5jDiazqN5a4Nwz/ylzPRNdero8cD3p3E3a8i7sGv12YszDuypoB4CooSE68g==
```

## Fase 2: Configuración de Autenticación con Clerk

### Tarea 2.1: Configurar Clerk Provider
**MCP Tools**: `filesystem`
- Modificar `src/app/layout.tsx`:
```typescript
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations' // Para español

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Tarea 2.2: Crear middleware para protección de rutas
**MCP Tools**: `filesystem`
- Crear `middleware.ts` en la raíz:
```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/public(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Tarea 2.3: Crear páginas de autenticación
**MCP Tools**: `filesystem`
- Crear `src/app/sign-in/[[...sign-in]]/page.tsx`
- Crear `src/app/sign-up/[[...sign-up]]/page.tsx`

## Fase 3: Conexión y Tipos de Supabase

### Tarea 3.1: Crear tipos TypeScript basados en las tablas
**MCP Tools**: `filesystem`
- Crear `src/types/database.types.ts`:
```typescript
export interface Book {
  id: number;
  nombre: string;
  testamento: string;
  abreviatura: string;
}

export interface Chapter {
  id: number;
  book_id: number;
  numero: number;
}

export interface Verse {
  id: number;
  chapter_id: number;
  numero: number;
  texto: string;
}

// Tipos extendidos con relaciones
export interface ChapterWithBook extends Chapter {
  book?: Book;
}

export interface VerseWithChapter extends Verse {
  chapter?: ChapterWithBook;
}
```

### Tarea 3.2: Configurar cliente Supabase
**MCP Tools**: `filesystem`
- Crear `src/lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- Crear `src/lib/supabase/server.ts` para Server Components

### Tarea 3.3: Crear funciones de consulta
**MCP Tools**: `filesystem`
- Crear `src/lib/supabase/queries.ts`:
```typescript
// Funciones para consultar libros, capítulos y versículos
// - getAllBooks()
// - getBookById(id)
// - getChaptersByBookId(bookId)
// - getVersesByChapterId(chapterId)
// - searchVerses(query)
```

## Fase 4: Desarrollo de Componentes UI

### Tarea 4.1: Crear componentes base con shadcn/ui
**MCP Tools**: `desktop-commander`, `filesystem`
```bash
# Inicializar shadcn/ui
npx shadcn-ui@latest init
# Instalar componentes necesarios
npx shadcn-ui@latest add button card input select command dialog sheet
```

### Tarea 4.2: Layout principal
**MCP Tools**: `filesystem`
- Header con navegación y UserButton de Clerk
- Sidebar con lista de libros (73 libros)
- Navegación por Antiguo/Nuevo Testamento
- Footer con información

### Tarea 4.3: Componentes específicos de la Biblia
**MCP Tools**: `filesystem`
- `BookSelector`: Selector de libros con búsqueda
- `ChapterGrid`: Grid de capítulos (números)
- `VerseDisplay`: Visualización de versículos
- `SearchBar`: Búsqueda global con Command (⌘K)
- `VerseCard`: Tarjeta individual de versículo

## Fase 5: Implementación de Páginas y Funcionalidades

### Tarea 5.1: Estructura de rutas
**MCP Tools**: `filesystem`
```
src/app/
├── page.tsx                          # Página principal con búsqueda
├── libros/
│   └── page.tsx                      # Lista de todos los libros
├── libro/
│   ├── [abreviatura]/
│   │   └── page.tsx                  # Vista del libro
│   └── [abreviatura]/
│       └── [capitulo]/
│           └── page.tsx              # Vista del capítulo
├── buscar/
│   └── page.tsx                      # Búsqueda avanzada
└── api/
    ├── libros/
    │   └── route.ts
    ├── capitulos/
    │   └── [bookId]/
    │       └── route.ts
    ├── versiculos/
    │   └── [chapterId]/
    │       └── route.ts
    └── buscar/
        └── route.ts
```

### Tarea 5.2: Página principal
**MCP Tools**: `filesystem`
- Hero section con búsqueda rápida
- Accesos directos a libros populares
- Lectura del día (opcional)
- Estadísticas (73 libros, 1,328 capítulos, 34,957 versículos)

### Tarea 5.3: Sistema de búsqueda
**MCP Tools**: `filesystem`, `supabase`
- Búsqueda por texto completo en versículos
- Búsqueda por referencia (ej: "Juan 3:16")
- Autocompletado con sugerencias
- Historial de búsquedas recientes

### Tarea 5.4: Funcionalidades adicionales
**MCP Tools**: `filesystem`, `supabase`
- Sistema de marcadores (favoritos)
- Copiar versículos al portapapeles
- Compartir versículos (Web Share API)
- Modo de lectura continua
- Navegación con teclas de flecha

## Fase 6: Optimización y UX

### Tarea 6.1: Performance
**MCP Tools**: `filesystem`
- Implementar React Query/TanStack Query para caché
- Lazy loading de componentes
- Prefetch de capítulos adyacentes
- Optimización de consultas SQL

### Tarea 6.2: Diseño responsive y accesibilidad
**MCP Tools**: `filesystem`
- Diseño mobile-first
- Modo oscuro/claro con next-themes
- Tamaño de fuente ajustable
- Navegación por teclado completa
- ARIA labels apropiados

### Tarea 6.3: SEO y metadatos
**MCP Tools**: `filesystem`
- Metadatos dinámicos para cada libro/capítulo
- Open Graph para compartir
- Sitemap.xml dinámico
- Robots.txt
- Canonical URLs

## Fase 7: Features Avanzados

### Tarea 7.1: PWA (Progressive Web App)
**MCP Tools**: `desktop-commander`, `filesystem`
```bash
npm install next-pwa
```
- Service Worker para offline
- Manifest.json
- Iconos para diferentes dispositivos

### Tarea 7.2: Análisis y métricas
**MCP Tools**: `filesystem`
- Integrar Google Analytics 4
- Tracking de búsquedas populares
- Libros más leídos

### Tarea 7.3: Testing
**MCP Tools**: `desktop-commander`, `filesystem`
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install -D cypress
```

## Estructura de Carpetas Final
```
biblia-jerusalen-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── libros/
│   │   │   ├── libro/
│   │   │   └── buscar/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── biblia/          # Componentes específicos
│   │   └── layout/          # Header, Footer, etc
│   ├── lib/
│   │   ├── supabase/
│   │   ├── utils/
│   │   └── constants.ts
│   ├── hooks/               # Custom hooks
│   ├── types/
│   └── styles/
├── public/
├── middleware.ts
└── package.json
```

## Queries SQL de Referencia

### Buscar versículos por texto
```sql
SELECT v.*, c.numero as capitulo_numero, c.book_id, b.nombre as libro_nombre, b.abreviatura
FROM verses v
JOIN chapters c ON v.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE v.texto ILIKE '%palabra%'
ORDER BY v.id
LIMIT 20;
```

### Obtener capítulo completo
```sql
SELECT v.*, c.numero as capitulo_numero, b.nombre as libro_nombre
FROM verses v
JOIN chapters c ON v.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE c.id = $1
ORDER BY v.numero;
```

## Notas Importantes para el Agente

1. **Base de datos existente**: No crear migraciones, usar las tablas existentes
2. **IDs**: Todos los IDs son numéricos (int4)
3. **Relaciones**: 
   - books → chapters (one-to-many via book_id)
   - chapters → verses (one-to-many via chapter_id)
4. **Caracteres especiales**: El texto puede contener tildes y eñes
5. **Performance**: Con 34,957 versículos, implementar paginación
6. **Seguridad**: Usar Supabase RLS si es necesario

## Comandos de Desarrollo
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Verificar tipos
npm run type-check

# Tests
npm run test
npm run cypress:open
```

---

**IMPORTANTE**: El agente debe comenzar obteniendo las API Keys de Supabase desde el dashboard antes de continuar con el desarrollo.