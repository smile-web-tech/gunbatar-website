# Günbatar Şapagy — Frontend (React)

Modern rebuild of the "Günbatar Şapagy" education-center site. Same layout and
content as the original, reimplemented as clean, fast, responsive React.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS v4** design system (brand blue `#4b7de1`, orange accent, dark mode)
- **framer-motion** (hero typewriter, scroll reveals, carousel)
- **lucide-react** icons, **react-router-dom** routing
- **yet-another-react-lightbox** (used by the gallery in Phase 2)

## Develop

```bash
cd web
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs static files to web/dist/
npm run preview  # preview the production build on :4173
```

## Deploy to cPanel (shared hosting)

1. Run `npm run build`.
2. Upload **the contents of `web/dist/`** into `public_html/` (it includes a
   `.htaccess` that does SPA routing, asset caching, and gzip).
3. Keep `public_html/images/` available (already bundled from `public/images/`).
4. The `.htaccess` leaves `/api` and `/admin` paths alone, so the new Laravel
   API (Phase 3) and the existing admin panel keep working alongside it.

## Structure

```
src/
  components/         Navbar, Footer, Hero, SmartLink, ScrollReveal, SectionHeading
    sections/         InfoCards, Courses, Features, GalleryPromo, Faq
  pages/              Home, GalleryPage (Phase 2 placeholder)
  hooks/useTheme.ts   light/dark theme with persistence
  lib/content.ts      ALL site text/data (edit copy here, not in markup)
  lib/scroll.ts       smooth in-page anchor scrolling
  lib/utils.ts        cn() class helper
```

To edit text, prices, phone numbers, courses, or FAQ → edit `src/lib/content.ts`.
