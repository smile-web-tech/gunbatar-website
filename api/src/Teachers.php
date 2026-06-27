<?php
/** Teachers listing, photo upload (WebP) and deletion. */

function teachers_list(PDO $pdo): array
{
    $rows = $pdo->query('SELECT id, name, role, photo, sort
        FROM teachers ORDER BY sort ASC, created_at ASC')->fetchAll();
    return array_map(fn ($r) => [
        'id'    => $r['id'],
        'name'  => $r['name'],
        'role'  => $r['role'],
        'photo' => $r['photo'],
    ], $rows);
}

function teacher_create(array $config, PDO $pdo): array
{
    if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        json_err('Surat ýüklenmedi.', 400);
    }
    $file = $_FILES['photo'];
    if ($file['size'] > $config['max_upload_bytes']) {
        json_err('Faýl gaty uly.', 413);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    if (!isset($config['allowed_types'][$mime]) || !str_starts_with($mime, 'image/')) {
        json_err('Diňe surat ýüklenip bilner.', 415);
    }

    $name = trim((string) ($_POST['name'] ?? ''));
    $role = trim((string) ($_POST['role'] ?? ''));
    if ($name === '') json_err('Mugallymyň ady gerek.', 422);

    $img = load_gd_image($file['tmp_name'], $mime);
    if (!$img) json_err('Surat okalyp bilmedi.', 422);

    $dir = rtrim($config['uploads_dir'], '/') . '/teachers';
    @mkdir($dir, 0775, true);
    $id = bin2hex(random_bytes(8));
    // Optimize: cap at 720px and re-encode to WebP (cards display ~480px).
    $scaled = scale_to_max($img, 720);
    imagewebp($scaled, "$dir/$id.webp", 76);
    imagedestroy($img);
    if ($scaled) imagedestroy($scaled);
    $photoUrl = $config['uploads_url'] . "/teachers/$id.webp";

    $sort = (int) $pdo->query('SELECT COALESCE(MAX(sort), 0) + 1 FROM teachers')->fetchColumn();
    $stmt = $pdo->prepare('INSERT INTO teachers (id, name, role, photo, sort, created_at)
        VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$id, $name, $role, $photoUrl, $sort, (int) (microtime(true) * 1000)]);

    return ['id' => $id, 'name' => $name, 'role' => $role, 'photo' => $photoUrl];
}

function teacher_delete(array $config, PDO $pdo, string $id): void
{
    $stmt = $pdo->prepare('SELECT photo FROM teachers WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_err('Tapylmady.', 404);

    $rel = str_replace($config['uploads_url'], '', (string) $row['photo']);
    $path = realpath($config['uploads_dir'] . $rel);
    if ($path && str_starts_with($path, realpath($config['uploads_dir']))) {
        @unlink($path);
    }
    $pdo->prepare('DELETE FROM teachers WHERE id = ?')->execute([$id]);
}
