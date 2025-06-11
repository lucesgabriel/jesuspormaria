-- ==========================================
-- MIGRACIÓN: Tablas de Usuario para App Biblia Jerusalén
-- ==========================================

-- Tabla de favoritos de usuario
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  verse_id INTEGER NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, verse_id)
);

-- Tabla de historial de búsquedas
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  font_size INTEGER DEFAULT 16,
  theme TEXT DEFAULT 'system',
  default_translation TEXT DEFAULT 'jerusalen-1976',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ÍNDICES PARA MEJOR PERFORMANCE
-- ==========================================

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_verse_id ON user_favorites(verse_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);

-- Índices para historial de búsquedas
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);

-- Índices para preferencias
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas de usuario
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS DE SEGURIDAD
-- ==========================================

-- Políticas para favoritos
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own favorites" ON user_favorites
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid()::text = user_id);

-- Políticas para historial de búsquedas
CREATE POLICY "Users can view their own search history" ON search_history
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own search history" ON search_history
  FOR DELETE USING (auth.uid()::text = user_id);

-- Políticas para preferencias
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid()::text = user_id);

-- ==========================================
-- CONFIGURACIÓN DE BÚSQUEDA FULL-TEXT
-- ==========================================

-- Configurar diccionario español para búsqueda
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índice para búsqueda de texto completo en versículos
CREATE INDEX IF NOT EXISTS idx_verses_texto_gin 
ON verses USING gin(to_tsvector('spanish', texto));

-- Índice trigrama para búsqueda difusa
CREATE INDEX IF NOT EXISTS idx_verses_texto_trgm 
ON verses USING gin(texto gin_trgm_ops);

-- ==========================================
-- FUNCIONES AUXILIARES
-- ==========================================

-- Función para actualizar timestamp de preferencias
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en preferencias
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ==========================================

-- Ejemplo de inserción de datos de prueba (comentado)
-- INSERT INTO user_favorites (user_id, verse_id, notes) VALUES
-- ('user_example_123', 1, 'Mi versículo favorito'),
-- ('user_example_123', 100, 'Muy inspirador');

-- ==========================================
-- VERIFICACIÓN
-- ==========================================

-- Verificar que las tablas se crearon correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_favorites', 'search_history', 'user_preferences')
ORDER BY table_name, ordinal_position; 