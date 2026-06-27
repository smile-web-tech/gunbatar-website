# Günbatar Şapagy — okuw merkezi

Website + admin portal for the "Günbatar Şapagy" education center, rebuilt as a
modern React frontend with a lightweight, secure PHP API.

## Structure

```
web/   React + Vite + TypeScript frontend (landing, gallery, teachers, /smm admin)
api/   PHP API — SQLite storage, bcrypt auth + HMAC tokens, WebP upload optimization
```

- **web/** — see [web/README.md](web/README.md) (dev, build, deploy).
- **api/** — see [api/README.md](api/README.md) (endpoints, config, password tool).
- **Deployment** (sweb.ru / shared hosting) — see [DEPLOY.md](DEPLOY.md).

## Quick start

```bash
# frontend
cd web && npm install && npm run dev        # http://localhost:5180

# API (separate terminal)
php -S localhost:8080 -t api api/router.php  # dev server; Apache uses api/.htaccess in prod
```

The frontend proxies `/api` to the PHP server in dev (see `web/vite.config.ts`).
In production both are served same-origin: the React build at the web root and the
API under `/api`.

## Configuration & secrets

`api/config.php` (the admin password hash + token secret) is **gitignored**.
Copy `api/config.sample.php` → `api/config.php` and set your own values, then:

```bash
php api/tools/set-password.php "your-admin-password"
```

The SQLite database (`api/data/`) and uploaded media (`api/uploads/`) are also
gitignored — they're created at runtime and seeded from `api/seed.json`.

## Features

- Landing page (light theme, hero 3D parallax, courses, FAQ, branches).
- Gallery — category filter, bento layout, lightbox, in-view video autoplay; API-driven.
- Teachers — single grid, API-driven.
- `/smm` admin — secure login, manage photos/videos and teachers by category,
  with automatic WebP optimization on upload.

© "Günbatar Şapagy" okuw merkezi — K-team.
