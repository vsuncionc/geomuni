# Geomuni · Torneo 2026

Página pública responsive para consultar los equipos y plantillas del torneo Geomuni. Es un sitio estático: usa Bootstrap 5.3 por CDN, Google Fonts y no requiere instalación local.

## Desarrollo local

Abre `index.html` directamente en el navegador o sirve el directorio con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica automáticamente el contenido de `main` en GitHub Pages. Para activarlo:

1. En **Settings → Pages**, selecciona **GitHub Actions** como fuente.
2. Haz merge/push a `main`.
3. La URL esperada es `https://vsuncionc.github.io/geomuni/`.

La publicación requiere que GitHub Pages esté habilitado en la configuración del repositorio y permisos de Actions para Pages.
