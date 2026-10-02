# Mundo Gelato

Sitio web de Mundo Gelato construido con React, Vite, TypeScript y CSS.

## Ejecutar localmente

Requisitos: Node.js 20 o superior.

```bash
npm ci
npm run dev
```

La integración opcional de Instagram usa estas variables de entorno:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Puedes copiar `.env.example` como `.env`. La página funciona sin esas variables; en ese caso la sección de Instagram muestra un enlace al perfil de Mundo Gelato en lugar de intentar hacer una petición inválida.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube **el contenido de esta carpeta en la raíz del repositorio** (no la carpeta contenedora).
2. Usa la rama `main`.
3. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente.
4. Haz un `push` a `main`. El workflow `.github/workflows/deploy-pages.yml` compilará y publicará automáticamente el sitio.

### Instagram en producción

El feed de Instagram es opcional. Para activarlo en GitHub Pages, crea dos Repository Secrets con estos nombres:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No subas el archivo `.env` al repositorio.

## Dominio propio

Cuando compres un dominio, podrás conectarlo desde **Settings → Pages → Custom domain** en el repositorio. El proyecto usa rutas de recursos relativas para que funcione tanto en la URL de GitHub Pages como posteriormente con un dominio propio.
