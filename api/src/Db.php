<?php
/** SQLite connection + schema + one-time seed from seed.json. */

function db(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $fresh = !file_exists($config['db_path']);
    if (!is_dir(dirname($config['db_path']))) {
        mkdir(dirname($config['db_path']), 0775, true);
    }

    $pdo = new PDO('sqlite:' . $config['db_path']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA journal_mode = WAL');

    $pdo->exec('CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, label TEXT NOT NULL, sort INTEGER DEFAULT 0
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT "",
        thumb TEXT NOT NULL,
        src TEXT NOT NULL,
        w INTEGER NOT NULL DEFAULT 0,
        h INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT "",
        photo TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
    )');

    if ($fresh) {
        seed_db($pdo, $config);
    }
    return $pdo;
}

function seed_db(PDO $pdo, array $config): void
{
    $seedFile = __DIR__ . '/../seed.json';
    if (!file_exists($seedFile)) return;
    $seed = json_decode(file_get_contents($seedFile), true);
    if (!is_array($seed)) return;

    $pdo->beginTransaction();
    $cat = $pdo->prepare('INSERT OR IGNORE INTO categories (id, label, sort) VALUES (?, ?, ?)');
    foreach ($seed['categories'] ?? [] as $c) {
        $cat->execute([$c['id'], $c['label'], $c['sort'] ?? 0]);
    }
    $now = time() * 1000;
    $i = 0;
    $m = $pdo->prepare('INSERT OR IGNORE INTO media
        (id, type, category, title, thumb, src, w, h, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($seed['media'] ?? [] as $item) {
        $i++;
        // Preserve order: older items first so seeds sort below new uploads.
        $m->execute([
            $item['id'], $item['type'], $item['category'], $item['title'] ?? '',
            $item['thumb'], $item['src'], $item['w'] ?? 0, $item['h'] ?? 0,
            $now - ($i * 60000),
        ]);
    }

    $t = $pdo->prepare('INSERT OR IGNORE INTO teachers
        (id, name, role, photo, sort, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($seed['teachers'] ?? [] as $teacher) {
        $t->execute([
            $teacher['id'], $teacher['name'], $teacher['role'] ?? '',
            $teacher['photo'], $teacher['sort'] ?? 0, $now,
        ]);
    }
    $pdo->commit();
}
