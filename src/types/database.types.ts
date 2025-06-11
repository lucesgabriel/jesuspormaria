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

// Tipos para funcionalidades de usuario (nuevas tablas)
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

// Tipo específico para consultas complejas de favoritos
export interface FavoriteWithCompleteVerse extends UserFavorite {
  verse?: {
    id: number;
    chapter_id: number;
    numero: number;
    texto: string;
    chapter?: {
      id: number;
      book_id: number;
      numero: number;
      book?: Book;
    };
  };
}

// Tipos para resultados de búsqueda
export interface SearchResult extends Verse {
  book_name: string;
  book_abbreviation: string;
  chapter_number: number;
  relevance?: number;
}

// Tipos para referencias bíblicas
export interface BiblicalReference {
  book: string;
  chapter?: number;
  verse?: number;
  endVerse?: number;
}

// Tipos para sugerencias de búsqueda
export interface SearchSuggestion {
  query: string;
  type: 'reference' | 'text' | 'book';
  frequency?: number;
}

// Tipos para búsqueda
export interface VerseWithBookAndChapter extends Verse {
  chapter?: Chapter;
  book?: Book;
  capitulo_numero?: number;
  libro_nombre?: string;
  abreviatura?: string;
}

// Tipos para navegación
export interface BookWithChapters extends Book {
  chapters?: Chapter[];
  total_chapters?: number;
}

export interface ChapterWithVerses extends ChapterWithBook {
  verses?: Verse[];
  total_verses?: number;
}

// Enums
export enum Testament {
  ANTIGUO = 'Antiguo Testamento',
  NUEVO = 'Nuevo Testamento'
}

// Tipos para componentes
export interface BookSelectorProps {
  onBookSelect: (book: Book) => void;
  selectedBook?: Book;
  testament?: Testament;
}

export interface ChapterGridProps {
  book: Book;
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
  selectedChapter?: Chapter;
}

export interface VerseDisplayProps {
  verses: Verse[];
  book: Book;
  chapter: Chapter;
  highlightText?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
} 