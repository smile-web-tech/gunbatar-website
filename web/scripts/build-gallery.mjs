/**
 * Gallery image optimizer.
 *
 * Reads the original photos, generates two optimized WebP sizes per image
 * (a light thumbnail for the grid + a larger one for the lightbox), and writes
 * a manifest (src/lib/gallery-data.json) with baked-in dimensions so the grid
 * has zero layout shift.
 *
 * Run from web/:  node scripts/build-gallery.mjs
 *
 * Later, the admin dashboard will replace this manifest with live data from the
 * API — the gallery UI reads the same shape either way.
 */
import sharp from 'sharp'
import { mkdir, readdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'

const ROOT = path.resolve('..')
const OUT_DIR = path.resolve('public/gallery')
const MANIFEST = path.resolve('src/lib/gallery-data.json')

const THUMB_W = 720 // grid thumbnail width
const FULL_MAX = 1600 // lightbox longest side
const THUMB_Q = 66
const FULL_Q = 78

/** category id -> { label, source dirs (relative to project root) } */
const CATEGORIES = [
  { id: 'dabaralar', label: 'Dabaralar & çäreler', dirs: ['memory-img'] },
  { id: 'gyzykly', label: 'Gyzykly pursatlar', dirs: ['Site15/Page1', 'Site15/Page1/Top7'] },
  { id: 'yatdan', label: 'Ýatdan çykmajak pursatlar', dirs: ['Site15/Page2'] },
  { id: 'bilelikde', label: 'Bilelikde', dirs: ['Site15/Page5'] },
]

const IMG_RE = /\.(jpe?g|png|webp)$/i

async function listImages(dirs) {
  const files = []
  for (const d of dirs) {
    const abs = path.join(ROOT, d)
    if (!existsSync(abs)) continue
    for (const f of await readdir(abs)) {
      if (IMG_RE.test(f)) files.push(path.join(abs, f))
    }
  }
  // stable numeric-ish sort by filename
  return files.sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }),
  )
}

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true })
  const categories = []
  let totalIn = 0
  let totalOut = 0

  for (const cat of CATEGORIES) {
    const srcFiles = await listImages(cat.dirs)
    const outFull = path.join(OUT_DIR, cat.id)
    const outThumb = path.join(OUT_DIR, cat.id, 't')
    await mkdir(outThumb, { recursive: true })

    const images = []
    let n = 0
    for (const src of srcFiles) {
      n += 1
      const base = String(n)
      const fullPath = path.join(outFull, `${base}.webp`)
      const thumbPath = path.join(outThumb, `${base}.webp`)

      const pipeline = sharp(src).rotate() // respect EXIF orientation

      const fullInfo = await pipeline
        .clone()
        .resize({ width: FULL_MAX, height: FULL_MAX, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: FULL_Q })
        .toFile(fullPath)

      const thumbInfo = await pipeline
        .clone()
        .resize({ width: THUMB_W, withoutEnlargement: true })
        .webp({ quality: THUMB_Q })
        .toFile(thumbPath)

      totalOut += fullInfo.size + thumbInfo.size
      images.push({
        thumb: `/gallery/${cat.id}/t/${base}.webp`,
        full: `/gallery/${cat.id}/${base}.webp`,
        w: thumbInfo.width,
        h: thumbInfo.height,
      })
    }

    categories.push({ id: cat.id, label: cat.label, count: images.length, images })
    console.log(`  ${cat.label.padEnd(28)} ${images.length} images`)
  }

  await writeFile(MANIFEST, JSON.stringify({ categories }, null, 2))
  console.log(
    `\n  optimized output: ${(totalOut / 1024 / 1024).toFixed(1)} MB (from ~33 MB sources)`,
  )
  console.log(`  manifest: ${path.relative(process.cwd(), MANIFEST)}`)
}

run()
