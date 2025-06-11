import { supabase } from './client'
import type { 
  Book, 
  Chapter, 
  Verse, 
  BookWithChapters, 
  ChapterWithVerses, 
  VerseWithBookAndChapter,
  SearchResult,
  UserFavorite,
  SearchHistory,
  UserPreferences,
  FavoriteWithVerse,
  BiblicalReference,
  SearchSuggestion
} from '@/types/database.types'

// ==================== BOOKS ====================

export async function getAllBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching books:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllBooks:', error)
    throw error
  }
}

export async function getBookById(id: number): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching book by id:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getBookById:', error)
    return null
  }
}

export async function getBookByAbbreviation(abreviatura: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('abreviatura', abreviatura)
      .single()

    if (error) {
      console.error('Error fetching book by abbreviation:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getBookByAbbreviation:', error)
    return null
  }
}

export async function getBooksByTestament(testamento: string): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('testamento', testamento)
      .order('id')

    if (error) {
      console.error('Error fetching books by testament:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getBooksByTestament:', error)
    throw error
  }
}

// ==================== CHAPTERS ====================

export async function getChaptersByBookId(bookId: number): Promise<Chapter[]> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('numero')

    if (error) {
      console.error('Error fetching chapters:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getChaptersByBookId:', error)
    throw error
  }
}

export async function getChapterById(id: number): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching chapter by id:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getChapterById:', error)
    throw error
  }
}

export async function getChapterByBookAndNumber(bookId: number, numero: number): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .eq('numero', numero)
      .single()

    if (error) {
      console.error('Error fetching chapter by book and number:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getChapterByBookAndNumber:', error)
    throw error
  }
}

// ==================== VERSES ====================

export async function getVersesByChapterId(chapterId: number): Promise<Verse[]> {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('numero')

    if (error) {
      console.error('Error fetching verses:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getVersesByChapterId:', error)
    throw error
  }
}

export async function getVerseById(id: number): Promise<Verse | null> {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching verse by id:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in getVerseById:', error)
    throw error
  }
}

// ==================== SEARCH ====================

export async function searchVerses(
  query: string, 
  userId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<SearchResult[]> {
  try {
    // Búsqueda básica por texto
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        chapters!inner(
          numero,
          books!inner(nombre, abreviatura)
        )
      `)
      .textSearch('texto', query, { type: 'websearch', config: 'spanish' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error in search:', error)
      throw error
    }

    // Registrar búsqueda si hay usuario
    if (userId && data?.length) {
      await registerSearchHistory(userId, query, data.length)
    }

    // Transformar resultados
    return data?.map(verse => {
      const chapter = verse.chapters as { numero: number; books: { nombre: string; abreviatura: string } }
      return {
        ...verse,
        book_name: chapter.books.nombre,
        book_abbreviation: chapter.books.abreviatura,
        chapter_number: chapter.numero
      }
    }) || []

  } catch (error) {
    console.error('Error searching verses:', error)
    throw error
  }
}

export async function searchByReference(reference: string): Promise<SearchResult[]> {
  try {
    const parsed = parseReference(reference)
    if (!parsed) return []

    let query = supabase
      .from('verses')
      .select(`
        *,
        chapters!inner(
          numero,
          books!inner(nombre, abreviatura)
        )
      `)

    // Filtrar por libro
    if (parsed.book) {
      query = query.or(`chapters.books.nombre.ilike.%${parsed.book}%,chapters.books.abreviatura.ilike.%${parsed.book}%`)
    }

    // Filtrar por capítulo
    if (parsed.chapter) {
      query = query.eq('chapters.numero', parsed.chapter)
    }

    // Filtrar por versículo(s)
    if (parsed.verse) {
      if (parsed.endVerse) {
        query = query.gte('numero', parsed.verse).lte('numero', parsed.endVerse)
      } else {
        query = query.eq('numero', parsed.verse)
      }
    }

    const { data, error } = await query.order('numero')

    if (error) throw error

    return data?.map(verse => {
      const chapter = verse.chapters as { numero: number; books: { nombre: string; abreviatura: string } }
      return {
        ...verse,
        book_name: chapter.books.nombre,
        book_abbreviation: chapter.books.abreviatura,
        chapter_number: chapter.numero
      }
    }) || []

  } catch (error) {
    console.error('Error searching by reference:', error)
    throw error
  }
}

// Parser de referencias bíblicas
function parseReference(reference: string): BiblicalReference | null {
  try {
    // Patrones para referencias bíblicas
    const patterns = [
      // "Juan 3:16" o "Jn 3:16"
      /^(\w+)\s+(\d+):(\d+)$/,
      // "Juan 3:16-20"
      /^(\w+)\s+(\d+):(\d+)-(\d+)$/,
      // "Juan 3" 
      /^(\w+)\s+(\d+)$/,
      // "Juan"
      /^(\w+)$/
    ]

    for (const pattern of patterns) {
      const match = reference.trim().match(pattern)
      if (match) {
        return {
          book: match[1],
          chapter: match[2] ? parseInt(match[2]) : undefined,
          verse: match[3] ? parseInt(match[3]) : undefined,
          endVerse: match[4] ? parseInt(match[4]) : undefined
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing reference:', error)
    return null
  }
}

// ==================== EXTENDED QUERIES ====================

export async function getBookWithChapters(bookId: number): Promise<BookWithChapters | null> {
  try {
    const book = await getBookById(bookId)
    if (!book) return null

    const chapters = await getChaptersByBookId(bookId)

    return {
      ...book,
      chapters,
      total_chapters: chapters.length
    }
  } catch (error) {
    console.error('Error in getBookWithChapters:', error)
    throw error
  }
}

export async function getChapterWithVerses(chapterId: number): Promise<ChapterWithVerses | null> {
  try {
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select(`
        *,
        books (*)
      `)
      .eq('id', chapterId)
      .single()

    if (chapterError) {
      console.error('Error fetching chapter with book:', chapterError)
      throw chapterError
    }

    const verses = await getVersesByChapterId(chapterId)

    return {
      ...chapter,
      verses,
      total_verses: verses.length
    }
  } catch (error) {
    console.error('Error in getChapterWithVerses:', error)
    throw error
  }
}

// ==================== UTILITY FUNCTIONS ====================

export async function getRandomVerse(): Promise<VerseWithBookAndChapter | null> {
  try {
    // Get a random verse ID first
    const { data: countData, error: countError } = await supabase
      .from('verses')
      .select('id', { count: 'exact', head: true })

    if (countError || !countData) {
      throw countError || new Error('Could not get verse count')
    }

    const randomId = Math.floor(Math.random() * 34957) + 1

    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        chapters!inner (
          id,
          numero,
          book_id,
          books!inner (
            id,
            nombre,
            abreviatura,
            testamento
          )
        )
      `)
      .eq('id', randomId)
      .single()

    if (error) {
      console.error('Error fetching random verse:', error)
      throw error
    }

    return {
      ...data,
      chapter: data.chapters,
      book: data.chapters?.books,
      capitulo_numero: data.chapters?.numero,
      libro_nombre: data.chapters?.books?.nombre,
      abreviatura: data.chapters?.books?.abreviatura
    }
  } catch (error) {
    console.error('Error in getRandomVerse:', error)
    throw error
  }
}

export async function getBibleStats() {
  try {
    const [booksCount, chaptersCount, versesCount] = await Promise.all([
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('chapters').select('*', { count: 'exact', head: true }),
      supabase.from('verses').select('*', { count: 'exact', head: true })
    ])

    return {
      books: booksCount.count || 0,
      chapters: chaptersCount.count || 0,
      verses: versesCount.count || 0
    }
  } catch (error) {
    console.error('Error getting Bible stats:', error)
    return {
      books: 73,
      chapters: 1328,
      verses: 34957
    }
  }
}

// ==========================================
// FUNCIONES DE FAVORITOS
// ==========================================

export async function getUserFavorites(userId: string): Promise<FavoriteWithVerse[]> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        verse:verses (
          *,
          chapter:chapters (
            *,
            book:books (*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    throw error
  }
}

export async function addFavorite(userId: string, verseId: number, notes?: string): Promise<UserFavorite> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        verse_id: verseId,
        notes
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error adding favorite:', error)
    throw error
  }
}

export async function removeFavorite(userId: string, verseId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('verse_id', verseId)

    if (error) throw error
  } catch (error) {
    console.error('Error removing favorite:', error)
    throw error
  }
}

export async function isVerseFavorite(userId: string, verseId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('verse_id', verseId)
      .maybeSingle()

    if (error) throw error

    return !!data
  } catch (error) {
    console.error('Error checking if verse is favorite:', error)
    return false
  }
}

export async function updateFavoriteNotes(userId: string, verseId: number, notes: string): Promise<UserFavorite> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .update({ notes })
      .eq('user_id', userId)
      .eq('verse_id', verseId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error updating favorite notes:', error)
    throw error
  }
}

export async function getFavoriteWithNotes(userId: string, verseId: number): Promise<UserFavorite | null> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('verse_id', verseId)
      .maybeSingle()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching favorite with notes:', error)
    return null
  }
}

// ==========================================
// FUNCIONES DE HISTORIAL DE BÚSQUEDA
// ==========================================

export async function registerSearchHistory(
  userId: string, 
  query: string, 
  resultsCount: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query,
        results_count: resultsCount
      })

    if (error && error.code !== '23505') { // Ignorar duplicados
      throw error
    }
  } catch (error) {
    console.error('Error registering search history:', error)
  }
}

export async function getUserSearchHistory(userId: string, limit: number = 10): Promise<SearchHistory[]> {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching search history:', error)
    throw error
  }
}

export async function getPopularSearches(limit: number = 10): Promise<SearchSuggestion[]> {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('query')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Última semana
      .order('created_at', { ascending: false })

    if (error) throw error

    // Contar frecuencias
    const queryCount: Record<string, number> = {}
    data?.forEach(item => {
      queryCount[item.query] = (queryCount[item.query] || 0) + 1
    })

    // Convertir a array y ordenar por frecuencia
    return Object.entries(queryCount)
      .map(([query, frequency]) => ({
        query,
        type: 'text' as const,
        frequency
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)

  } catch (error) {
    console.error('Error fetching popular searches:', error)
    return []
  }
}

// ==========================================
// FUNCIONES DE PREFERENCIAS
// ==========================================

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return null
  }
}

export async function updateUserPreferences(
  userId: string, 
  preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserPreferences> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error updating user preferences:', error)
    throw error
  }
} 