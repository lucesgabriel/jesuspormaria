# 📖 Biblia Jerusalén Católica

Una aplicación web moderna para leer la Biblia Jerusalén Católica con sistema de favoritos, búsqueda avanzada y autenticación de usuarios.

## 🌟 Características

- **📚 Biblioteca completa**: 73 libros, 1,328 capítulos, 34,957 versículos
- **🔍 Búsqueda avanzada**: Busca por texto, referencias bíblicas o palabras clave
- **❤️ Sistema de favoritos**: Guarda versículos con notas personales
- **🔐 Autenticación**: Sistema seguro con Clerk Authentication
- **📱 Responsive**: Optimizado para móviles, tablets y desktop
- **🌙 Modo oscuro**: Interfaz adaptativa con soporte para modo claro/oscuro
- **⚡ Performance**: Carga rápida con Next.js 15 y App Router

## 🚀 Demo en Vivo

**🌐 Sitio Web**: [https://jesuspormaria-2.netlify.app](https://jesuspormaria-2.netlify.app)

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Autenticación**: Clerk
- **Base de datos**: Supabase (PostgreSQL)
- **Deployment**: Netlify
- **Dev Tools**: ESLint, PostCSS

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Clerk (para autenticación)
- Proyecto en Supabase (para base de datos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/biblia-jerusalen-catolica.git
cd biblia-jerusalen-catolica
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. Configurar base de datos
Ejecuta las migraciones en Supabase usando el archivo `supabase-migrations.sql`:

```sql
-- Tablas de usuario (favoritos, historial, preferencias)
-- Ver archivo supabase-migrations.sql para el script completo
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## 📁 Estructura del Proyecto

```
biblia-jerusalen-catolica/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── libro/             # Páginas de libros y capítulos
│   │   ├── favoritos/         # Gestión de favoritos
│   │   └── buscar/            # Búsqueda avanzada
│   ├── components/
│   │   ├── ui/                # Componentes UI base (Radix)
│   │   ├── biblia/            # Componentes específicos
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── supabase/          # Configuración y queries
│   │   └── utils.ts           # Utilidades
│   └── types/                 # Tipos TypeScript
├── public/                    # Assets estáticos
├── middleware.ts              # Middleware de autenticación
└── netlify.toml              # Configuración de deployment
```

## 🎯 Funcionalidades Principales

### 📖 Lectura de la Biblia
- Navegación por libros del Antiguo y Nuevo Testamento
- Vista por capítulos con navegación fluida
- Texto optimizado para lectura en pantalla

### 🔍 Sistema de Búsqueda
- Búsqueda por texto completo
- Búsqueda por referencias (ej: "Juan 3:16")
- Autocompletado inteligente
- Historial de búsquedas

### ❤️ Favoritos con Notas
- Marcar versículos como favoritos
- Agregar notas personales (hasta 500 caracteres)
- Organizar y filtrar favoritos
- Exportar colecciones

### 🔐 Autenticación
- Registro y login seguro con Clerk
- Sesiones persistentes
- Protección de rutas privadas

## 🚀 Deployment

### Netlify (Recomendado)
1. Fork este repositorio
2. Conecta tu cuenta de Netlify con GitHub
3. Configura las variables de entorno en Netlify
4. Deploy automático en cada push

### Vercel
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t biblia-jerusalen .
docker run -p 3000:3000 biblia-jerusalen
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/TU_USUARIO/biblia-jerusalen-catolica/issues)
- **Documentación**: Ver archivos `DEPLOYMENT.md` y `CHANGELOG.md`
- **Status del proyecto**: Ver `STATUS.md`

## 🙏 Agradecimientos

- **Clerk** por el sistema de autenticación
- **Supabase** por la base de datos
- **Netlify** por el hosting
- **Radix UI** por los componentes accesibles
- **Comunidad católica** por el feedback y sugerencias

---

*Desarrollado con ❤️ para la comunidad católica hispanohablante*

**📖 "Tu palabra es lámpara para mis pasos y luz para mi sendero" - Salmo 119:105**
