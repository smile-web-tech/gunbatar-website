# SMM API (PHP)

Secure, dependency-free PHP API that powers the `/smm` admin dashboard and the
public gallery. Runs on shared cPanel hosting (PHP 8+, SQLite, GD with WebP).

## Endpoints

| Method | Path                | Auth | Purpose                              |
|--------|---------------------|------|--------------------------------------|
| POST   | `/api/login`        | —    | `{username,password}` → `{token}`    |
| GET    | `/api/categories`   | —    | list categories                      |
| GET    | `/api/media`        | —    | list all media (newest first)        |
| POST   | `/api/media`        | ✅   | upload (multipart: file, category…)  |
| DELETE | `/api/media/{id}`   | ✅   | delete a media item + its files      |
| GET    | `/api/teachers`     | —    | list teachers (principal first)      |
| POST   | `/api/teachers`     | ✅   | add teacher (multipart: photo,name,role) |
| DELETE | `/api/teachers/{id}`| ✅   | delete a teacher + photo             |

Auth is a Bearer token (HMAC-SHA256 signed, 7‑day expiry). Uploads generate
optimized **WebP** (full + thumbnail) for images; for videos the client sends a
poster frame + dimensions, the file is stored as‑is.

## Security

- Passwords are **bcrypt** hashed (`config.php` → `admin_pass_hash`).
- Tokens are signed with `app_secret`; rotate it to log everyone out.
- Uploads: MIME‑validated whitelist, size cap, random filenames, category
  validated against the DB. `uploads/.htaccess` disables script execution;
  `data/.htaccess` blocks the SQLite DB from the web.
- **Change the default password before going live:**
  ```
  php tools/set-password.php "a-strong-password"
  ```

## Local development

```bash
# 1. API (from the project root)
php -d upload_max_filesize=64M -d post_max_size=72M \
    -S localhost:8080 -t api api/router.php

# 2. Frontend (proxies /api -> :8080)
cd web && npm run dev
```

The SQLite DB is created and **seeded from `seed.json`** on first request.

## Deploy to cPanel

1. Upload the `api/` folder into `public_html/api/`.
2. Ensure `data/` and `uploads/` are writable by PHP (755/775).
3. Set upload limits if videos are large (cPanel → MultiPHP INI, or `api/.htaccess`).
4. Run the password tool once over SSH (or set `admin_pass_hash` manually).
5. The frontend calls `/api` same‑origin — nothing else to configure.
