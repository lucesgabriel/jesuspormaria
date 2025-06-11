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

// Tipos para funcionalidades de usuario
export interface UserFavorite {
  id: string;
  user_id: string; // Clerk user ID
  verse_id: number;
  created_at: string;
  notes?: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  font_size: number;
  theme: 'light' | 'dark' | 'system';
  default_translation: string;
  created_at: string;
  updated_at: string;
}

// Tipos extendidos con relaciones
export interface ChapterWithBook extends Chapter {
  book?: Book;
}

export interface VerseWithChapter extends Verse {
  chapter?: ChapterWithBook;
}

export interface FavoriteWithVerse extends UserFavorite {
  verse?: VerseWithChapter;
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

### Tarea 3.3: Crear tablas adicionales en Supabase
**MCP Tools**: `supabase`, `filesystem`
- Ejecutar migrations para crear nuevas tablas:
```sql
-- Tabla de favoritos
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  verse_id INTEGER NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, verse_id)
);

-- Tabla de historial de búsquedas
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preferencias de usuario
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  font_size INTEGER DEFAULT 16,
  theme TEXT DEFAULT 'system',
  default_translation TEXT DEFAULT 'jerusalen-1976',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- RLS (Row Level Security)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can manage their own favorites" ON user_favorites
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own search history" ON search_history
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid()::text = user_id);
```

### Tarea 3.4: Crear funciones de consulta
**MCP Tools**: `filesystem`
- Crear `src/lib/supabase/queries.ts`:
```typescript
// Funciones básicas
// - getAllBooks()
// - getBookById(id)
// - getChaptersByBookId(bookId)
// - getVersesByChapterId(chapterId)

// Funciones de búsqueda inteligente
// - searchVerses(query, userId) - con registro en historial
// - searchByReference(reference) - ej: "Juan 3:16"
// - getSimilarVerses(verseId) - versículos relacionados
// - getSearchSuggestions(partial) - autocompletado

// Funciones de favoritos
// - getUserFavorites(userId)
// - addFavorite(userId, verseId, notes?)
// - removeFavorite(userId, verseId)
// - updateFavoriteNotes(userId, verseId, notes)

// Funciones de historial
// - getUserSearchHistory(userId, limit)
// - getPopularSearches()
// - clearUserSearchHistory(userId)

// Funciones de preferencias
// - getUserPreferences(userId)
// - updateUserPreferences(userId, preferences)
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
- `VerseDisplay`: Visualización de versículos con opción de favorito
- `SearchBar`: Búsqueda inteligente con Command (⌘K)
- `VerseCard`: Tarjeta con acciones (favorito, copiar, compartir)
- `FavoriteButton`: Botón animado para marcar favoritos
- `SearchSuggestions`: Autocompletado inteligente
- `FavoritesList`: Lista de versículos favoritos
- `RecentSearches`: Historial de búsquedas recientes

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
## API Routes para Funcionalidades de Usuario

### Routes de Favoritos
```typescript
// src/app/api/user/favorites/route.ts - GET, POST
// src/app/api/user/favorites/[id]/route.ts - DELETE, PATCH
// src/app/api/user/favorites/export/route.ts - Exportar favoritos
// src/app/api/user/favorites/collections/route.ts - Colecciones
```

### Routes de Búsqueda Inteligente
```typescript
// src/app/api/search/smart/route.ts - Búsqueda con IA
// src/app/api/search/suggestions/route.ts - Autocompletado
// src/app/api/search/history/route.ts - Historial personal
// src/app/api/search/trending/route.ts - Tendencias
```

### Routes de Usuario
```typescript
// src/app/api/user/preferences/route.ts - Preferencias
// src/app/api/user/stats/route.ts - Estadísticas
// src/app/api/user/sync/route.ts - Sincronización
```
```

### Tarea 5.2: Página principal
**MCP Tools**: `filesystem`
- Hero section con búsqueda rápida
- Accesos directos a libros populares
- Lectura del día (opcional)
- Estadísticas (73 libros, 1,328 capítulos, 34,957 versículos)

### Tarea 5.3: Sistema de búsqueda inteligente
**MCP Tools**: `filesystem`, `supabase`
- **Búsqueda por texto completo** con ranking de relevancia
- **Búsqueda por referencia** (ej: "Juan 3:16", "Jn 3:16", "Juan 3")
- **Búsqueda contextual**: mostrar versículos anteriores/posteriores
- **Búsqueda difusa**: tolerar errores de escritura
- **Sugerencias inteligentes** basadas en:
  - Historial personal del usuario
  - Búsquedas populares globales
  - Libros/capítulos recientemente visitados
- **Filtros avanzados**:
  - Por testamento (Antiguo/Nuevo)
  - Por libro específico
  - Por rango de capítulos
- **Registro de búsquedas** para análisis y mejoras

### Tarea 5.4: Sistema de favoritos persistente
**MCP Tools**: `filesystem`, `supabase`
- **Marcar/desmarcar favoritos** con animación
- **Notas personales** en cada favorito
- **Categorías/etiquetas** para organizar favoritos
- **Vista de favoritos** con filtros y búsqueda
- **Exportar favoritos** (PDF, texto plano)
- **Sincronización** entre dispositivos
- **Límite de favoritos** según plan de usuario (opcional)

### Tarea 5.5: Funcionalidades adicionales para usuarios autenticados
**MCP Tools**: `filesystem`, `supabase`
- **Plan de lectura**: seguimiento de progreso
- **Compartir colecciones** de versículos
- **Modo estudio**: comparar traducciones (futuro)
- **Estadísticas personales**:
  - Tiempo de lectura
  - Libros más leídos
  - Racha de días consecutivos
- **Notificaciones** (opcional):
  - Recordatorio de lectura diaria
  - Versículo del día personalizado

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

## Fase 8: Implementación de Búsqueda Inteligente

### Tarea 8.1: Motor de búsqueda avanzado
**MCP Tools**: `filesystem`, `supabase`
- Crear `src/lib/search/engine.ts`:
```typescript
// Parser de referencias bíblicas
// - parseReference("Juan 3:16") -> {book, chapter, verse}
// - parsePartialReference("Jn 3") -> {book, chapter}

// Algoritmo de búsqueda difusa
// - fuzzySearch(query, threshold)
// - calculateRelevance(verse, query)

// Búsqueda con IA (usando Perplexity/OpenAI)
// - semanticSearch(query) - búsqueda por concepto
// - explainVerse(verseId) - contexto histórico
```

### Tarea 8.2: Sistema de sugerencias inteligentes
**MCP Tools**: `filesystem`, `supabase`, `perplexity-ask`
- Implementar autocompletado predictivo
- Sugerencias basadas en:
  - Frecuencia de búsqueda global
  - Historial personal
  - Contexto actual (libro/capítulo abierto)
- Cache de sugerencias frecuentes
- Usar Perplexity para mejorar resultados

### Tarea 8.3: Análisis de búsquedas
**MCP Tools**: `filesystem`, `supabase`
- Dashboard de analytics (admin)
- Métricas:
  - Términos más buscados
  - Versículos más visitados
  - Patrones de búsqueda por hora/día
- Exportar reportes

## Fase 9: Sistema de Favoritos Avanzado

### Tarea 9.1: UI/UX de favoritos
**MCP Tools**: `filesystem`
- Animaciones con Framer Motion
- Drag & drop para organizar
- Carpetas/colecciones de favoritos
- Vista en mosaico/lista
- Filtros y ordenamiento

### Tarea 9.2: Funcionalidades sociales
**MCP Tools**: `filesystem`, `supabase`
- Compartir colecciones públicas
- Seguir colecciones de otros usuarios
- Comentarios en versículos (moderados)
- "Me gusta" en colecciones

### Tarea 9.3: Exportación y backup
**MCP Tools**: `filesystem`, `supabase`
- Exportar a PDF con formato bonito
- Exportar a Word/Google Docs
- Backup automático en la nube
- Importar favoritos desde otras apps

## Fase 10: Optimización para Usuarios Autenticados

### Tarea 10.1: Middleware de autenticación
**MCP Tools**: `filesystem`
```typescript
// Proteger rutas específicas
export const config = {
  matcher: [
    '/favoritos/:path*',
    '/perfil/:path*',
    '/api/user/:path*',
  ],
};
```

### Tarea 10.2: Estados de UI para usuarios
**MCP Tools**: `filesystem`
- Componentes con estados:
  - No autenticado: mostrar CTA de registro
  - Autenticado: mostrar funciones completas
  - Plan gratuito vs premium (futuro)
- Lazy loading de features premium

### Tarea 10.3: Sincronización en tiempo real
**MCP Tools**: `filesystem`, `supabase`
- Usar Supabase Realtime para:
  - Sincronizar favoritos entre pestañas
  - Notificaciones en vivo
  - Colaboración en colecciones

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

### Buscar versículos con búsqueda inteligente
```sql
-- Búsqueda con ranking de relevancia
WITH search_results AS (
  SELECT 
    v.*,
    c.numero as capitulo_numero,
    c.book_id,
    b.nombre as libro_nombre,
    b.abreviatura,
    ts_rank(to_tsvector('spanish', v.texto), plainto_tsquery('spanish', $1)) as relevance
  FROM verses v
  JOIN chapters c ON v.chapter_id = c.id
  JOIN books b ON c.book_id = b.id
  WHERE to_tsvector('spanish', v.texto) @@ plainto_tsquery('spanish', $1)
  ORDER BY relevance DESC
  LIMIT 20
)
SELECT * FROM search_results;

-- Registrar búsqueda en historial
INSERT INTO search_history (user_id, query, results_count)
VALUES ($1, $2, $3);
```

### Gestión de favoritos
```sql
-- Obtener favoritos con información completa
SELECT 
  f.*,
  v.numero as verse_numero,
  v.texto,
  c.numero as chapter_numero,
  b.nombre as book_nombre,
  b.abreviatura
FROM user_favorites f
JOIN verses v ON f.verse_id = v.id
JOIN chapters c ON v.chapter_id = c.id
JOIN books b ON c.book_id = b.id
WHERE f.user_id = $1
ORDER BY f.created_at DESC;

-- Verificar si un versículo es favorito
SELECT EXISTS(
  SELECT 1 FROM user_favorites 
  WHERE user_id = $1 AND verse_id = $2
) as is_favorite;
```

### Sugerencias inteligentes
```sql
-- Búsquedas populares globales
SELECT query, COUNT(*) as count
FROM search_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query
ORDER BY count DESC
LIMIT 10;

-- Búsquedas frecuentes del usuario
SELECT query, COUNT(*) as count
FROM search_history
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY count DESC
LIMIT 5;
```

## Notas Importantes para el Agente

1. **Base de datos existente**: No crear migraciones para las tablas existentes (books, chapters, verses)
2. **Nuevas tablas**: Crear migrations solo para user_favorites, search_history, user_preferences
3. **Autenticación**: Todas las funcionalidades nuevas requieren usuario autenticado con Clerk
4. **IDs de usuario**: Usar el ID de Clerk (string) para relacionar con Supabase
5. **Búsqueda en español**: Configurar full-text search con diccionario español
6. **Performance**: 
   - Implementar paginación (34,957 versículos)
   - Cache agresivo para búsquedas frecuentes
   - Índices en todas las foreign keys
7. **Seguridad**: 
   - RLS habilitado para tablas de usuario
   - Validar que user_id coincida con el token de Clerk
8. **UX para no autenticados**:
   - Permitir búsqueda básica y lectura
   - Mostrar preview de funcionalidades premium
   - CTAs claros para registro

## Flujo de Usuario

### Usuario No Autenticado:
1. Puede buscar y leer versículos
2. Ve botones de favoritos deshabilitados
3. Al hacer clic → modal de registro/login
4. Búsqueda limitada a 10 resultados

### Usuario Autenticado:
1. Búsqueda ilimitada con sugerencias
2. Guardar favoritos con notas
3. Historial de búsquedas persistente
4. Sincronización entre dispositivos
5. Exportar colecciones
6. Estadísticas personales

## Testing de Funcionalidades Clave
```typescript
// Tests E2E con Cypress
- Flujo completo de favoritos
- Búsqueda con diferentes queries
- Sincronización entre pestañas
- Exportación de datos
- Límites para usuarios no autenticados
```

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