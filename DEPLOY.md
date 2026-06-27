# Deploying to sweb.ru (easy way)

Everything is bundled in **`gunbatar-deploy.zip`** (project root). No MySQL needed —
the API uses a SQLite file that is created and seeded automatically on first visit.

## What's inside the zip (goes into your site's web root)
```
index.html, assets/, gallery/, teachers/, smm/, images/, hero/, memory-img/, .htaccess
api/                  ← the PHP backend (SQLite DB + uploads live here)
```

## Steps

1. **Pick PHP 8.x** for your site in the sweb.ru control panel (PHP version selector).
2. Open the sweb.ru **File Manager** and go to your domain's web root
   (the public folder for the site, e.g. `.../<domain>/public_html`).
3. **Upload `gunbatar-deploy.zip`** there.
4. **Extract** it (right-click → Extract). You should now see `index.html`, `api/`,
   `gallery/`, etc. directly in the web root. Delete the zip afterwards.
5. Make these two folders **writable** (CHMOD `755`, or `775` if needed):
   - `api/data`
   - `api/uploads`
6. Open **`https://YOURDOMAIN/api/check.php`** — confirm every line says **YES**,
   then **delete `check.php`**.
7. Open **`https://YOURDOMAIN/`** — the site loads. Visit `/galereya` and
   `/mugallymlar` (these fetch from the API; the DB seeds itself on the first hit).

## Admin login

- URL: **`https://YOURDOMAIN/smm`**
- User / password: **`admin` / `shapagyShapagy1702!`**

**Change the password** (do this):
- With SSH: `php api/tools/set-password.php "your-new-password"`
- Without SSH: generate a bcrypt hash anywhere (e.g. an online `password_hash` tool)
  and paste it into `api/config.php` → `admin_pass_hash`.

## Troubleshooting

- **Deep links 404 on refresh** (e.g. `/galereya`): `.htaccess`/mod_rewrite isn't
  active — ask sweb.ru support to enable it (usually on by default for Apache).
- **Video upload fails / "file too large"**: the `api/.user.ini` raises the limit to
  64 MB; if the host ignores it, raise `upload_max_filesize` in the panel's PHP settings.
- **`check.php` shows GD WebP = NO**: ask support to enable the GD WebP module, or
  switch the site to a PHP 8.x build that includes it.

## Updating later (new frontend build)

```bash
cd web && npm run build      # rebuild
# re-upload the contents of web/dist/ to the web root (keep the api/ folder + its data/)
```
Don't overwrite `api/data/` or `api/uploads/` on updates — that's your live database
and uploaded media.
