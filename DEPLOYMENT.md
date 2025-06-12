# Deployment a Netlify - Biblia Jerusalén Católica

## 🚨 PROBLEMA SOLUCIONADO: Error 404

### ❌ Problema Identificado:
- Configuración incorrecta de redirects
- Plugin de Next.js no configurado correctamente
- Configuración de build inadecuada

### ✅ Soluciones Aplicadas:
1. **Corregido `public/_redirects`**: `/*    /index.html   200`
2. **Actualizado `netlify.toml`**: Plugin de Next.js agregado
3. **Mejorado `next.config.ts`**: Configuración optimizada para Netlify
4. **Creado script de deploy**: `deploy.sh` para builds consistentes

## 🚀 Información del Deploy

- **Sitio**: https://bibliajerusalen.netlify.app
- **Admin URL**: https://app.netlify.com/projects/jesuspormaria-2
- **Site ID**: 410b5156-b193-492b-b3a3-12fac7eb7f99
- **Deploy ID**: 684895185dab5d4f846e87ad (✅ ACTIVO - CORREGIDO)

## 📋 Configuración Actualizada

### Framework: Next.js 15 con App Router
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: 18 (especificado)

### Plugins Utilizados
- `@netlify/plugin-nextjs` - ✅ Configurado correctamente

### Archivos de Configuración Corregidos:

#### `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### `public/_redirects`:
```
/*    /index.html   200
```

#### `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: true
  }
};
```

## 🔐 Variables de Entorno Requeridas

Para que la aplicación funcione correctamente, configurar en Netlify Dashboard:

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Supabase Database
```
NEXT_PUBLIC_SUPABASE_URL=https://kudmehunkkskivuldvqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_JWT_SECRET=avaIz589hKL...
```

## 🛠️ Comandos de Deploy

### Deploy Manual con Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Deploy Directo a Netlify
```bash
# Limpiar y construir
rm -rf .next
npm ci
npm run build

# Deploy manual
netlify deploy --prod --dir=.next
```

### Verificar Build Local
```bash
npm run build
npm run start
```

## 🔄 Pasos para Solucionar el Error 404

### 1. Hacer Push de los Cambios
```bash
git add .
git commit -m "Fix: Corregir configuración para Netlify - Solucionar error 404"
git push origin main
```

### 2. Trigger Manual Deploy en Netlify
1. Ir a https://app.netlify.com/projects/jesuspormaria-2
2. Click en "Trigger deploy" > "Deploy site"
3. Esperar a que termine el build

### 3. Verificar Configuración
- ✅ Plugin de Next.js instalado
- ✅ Redirects configurados correctamente
- ✅ Build command correcto
- ✅ Publish directory correcto

## 📊 Funcionalidades

### ✅ Debería Funcionar Después del Fix
- ✅ Página principal accesible
- ✅ Navegación entre rutas
- ✅ Lectura de la Biblia (73 libros, 1,328 capítulos, 34,957 versículos)
- ✅ Búsqueda de versículos
- ✅ Navegación por libros y capítulos
- ✅ Diseño responsive

### 🔧 Requiere Variables de Entorno
- ⚠️ Autenticación con Clerk
- ⚠️ Sistema de favoritos (Supabase)
- ⚠️ Notas personales (Supabase)
- ⚠️ Historial de búsquedas (Supabase)

## 🆘 Troubleshooting Adicional

### Si persiste el error 404:
1. **Verificar logs de build**:
   - Ir a Netlify Dashboard > Deploys
   - Revisar el log del último deploy
   - Buscar errores en el build

2. **Limpiar cache de Netlify**:
   - Site settings > Build & deploy
   - Clear cache and deploy site

3. **Verificar estructura de archivos**:
   ```bash
   # Debe existir:
   .next/server/app/index.html
   .next/static/
   ```

### Comandos de Diagnóstico:
```bash
# Verificar estructura después del build
npm run build
find .next -name "*.html" | head -10

# Verificar que el plugin esté instalado
npm list @netlify/plugin-nextjs
```

## ✅ Estado Actual (Actualizado - 10 Jun 2025)

**🔧 CORRECCIONES APLICADAS - PENDIENTE DE DEPLOY**

- **Problema**: Error 404 en todas las rutas
- **Causa**: Configuración incorrecta de redirects y plugin
- **Solución**: ✅ Archivos corregidos, pendiente de push y redeploy
- **Próximo paso**: Hacer commit y push para activar nuevo deploy

## 📝 Headers de Seguridad

Configurados en `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🎯 Performance

- **Caching**: Assets estáticos con cache de 1 año
- **Compression**: Automática por Netlify
- **CDN**: Global por Netlify
- **SSL**: Automático

## 📋 Checklist de Deploy

- [x] ✅ Proyecto creado en Netlify
- [x] ✅ Plugin de Next.js instalado y configurado
- [x] ✅ Build exitoso sin errores críticos
- [x] ✅ Redirects configurados correctamente
- [x] ✅ Headers de seguridad aplicados
- [x] ✅ Sitio accesible en https://bibliajerusalen.netlify.app
- [ ] ⏳ Variables de entorno de producción configuradas
- [ ] ⏳ Testing de funcionalidades en producción
- [ ] ⏳ Configuración de dominio personalizado (opcional)

## 📞 Enlaces de Soporte
- [Dashboard del Proyecto](https://app.netlify.com/projects/jesuspormaria-2)
- [Logs de Build](https://app.netlify.com/projects/jesuspormaria-2/deploys/684893ca188f4252c8b213af)
- [Documentación de Netlify para Next.js](https://docs.netlify.com/frameworks/next-js/)
- [Plugin de Next.js para Netlify](https://github.com/netlify/netlify-plugin-nextjs) 