<?php
/** Media listing, upload (with WebP thumbnail generation) and deletion. */

function media_list(PDO $pdo): array
{
    $rows = $pdo->query('SELECT id, type, category, title, thumb, src, w, h, created_at
        FROM media ORDER BY created_at DESC')->fetchAll();
    return array_map(function ($r) {
        return [
            'id'        => $r['id'],
            'type'      => $r['type'],
            'category'  => $r['category'],
            'title'     => $r['title'],
            'thumb'     => $r['thumb'],
            'src'       => $r['src'],
            'w'         => (int) $r['w'],
            'h'         => (int) $r['h'],
            'createdAt' => (int) $r['created_at'],
        ];
    }, $rows);
}

function categories_list(PDO $pdo): array
{
    return $pdo->query('SELECT id, label FROM categories ORDER BY sort, label')->fetchAll();
}

function media_create(array $config, PDO $pdo): array
{
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        json_err('Faýl ýüklenmedi.', 400);
    }
    $file = $_FILES['file'];
    if ($file['size'] > $config['max_upload_bytes']) {
        json_err('Faýl gaty uly.', 413);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    if (!isset($config['allowed_types'][$mime])) {
        json_err('Rugsat edilmedi faýl görnüşi: ' . $mime, 415);
    }
    $ext = $config['allowed_types'][$mime];
    $isVideo = str_starts_with($mime, 'video/');

    // Validate category against the DB.
    $category = preg_replace('/[^a-z0-9_-]/i', '', (string) ($_POST['category'] ?? ''));
    $exists = $pdo->prepare('SELECT 1 FROM categories WHERE id = ?');
    $exists->execute([$category]);
    if (!$exists->fetchColumn()) {
        json_err('Nädogry kategoriýa.', 422);
    }

    $title = trim((string) ($_POST['title'] ?? ''));
    $id    = bin2hex(random_bytes(8));

    $catDir   = rtrim($config['uploads_dir'], '/') . '/' . $category;
    $thumbDir = $catDir . '/thumb';
    @mkdir($thumbDir, 0775, true);

    $base   = $config['uploads_url'] . '/' . $category;
    $w = 0; $h = 0;
    $thumbUrl = '';
    $srcUrl   = '';

    if ($isVideo) {
        $dest = "$catDir/$id.$ext";
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            json_err('Faýl saklanyp bilmedi.', 500);
        }
        $srcUrl = "$base/$id.$ext";
        $w = (int) ($_POST['w'] ?? 1280);
        $h = (int) ($_POST['h'] ?? 720);
        // Poster: client sends a data URL frame; else a neutral placeholder.
        $thumbPath = "$thumbDir/$id.webp";
        if (!save_poster_from_dataurl((string) ($_POST['poster'] ?? ''), $thumbPath)) {
            make_placeholder($thumbPath, 1280, 720);
        }
        $thumbUrl = "$base/thumb/$id.webp";
    } else {
        $img = load_gd_image($file['tmp_name'], $mime);
        if (!$img) json_err('Surat okalyp bilmedi.', 422);
        $w = imagesx($img);
        $h = imagesy($img);
        // Optimized full (cap 1600px longest side) + thumbnail (720px wide), both WebP.
        $full = scale_to_max($img, 1600);
        imagewebp($full, "$catDir/$id.webp", 80);
        $thumb = scale_to_width($img, 720);
        imagewebp($thumb, "$thumbDir/$id.webp", 68);
        imagedestroy($img);
        if ($full) imagedestroy($full);
        if ($thumb) imagedestroy($thumb);
        $srcUrl   = "$base/$id.webp";
        $thumbUrl = "$base/thumb/$id.webp";
    }

    $createdAt = (int) (microtime(true) * 1000);
    $stmt = $pdo->prepare('INSERT INTO media
        (id, type, category, title, thumb, src, w, h, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $id, $isVideo ? 'video' : 'image', $category,
        $title !== '' ? $title : category_label($pdo, $category),
        $thumbUrl, $srcUrl, $w, $h, $createdAt,
    ]);

    return [
        'id' => $id, 'type' => $isVideo ? 'video' : 'image', 'category' => $category,
        'title' => $title !== '' ? $title : category_label($pdo, $category),
        'thumb' => $thumbUrl, 'src' => $srcUrl, 'w' => $w, 'h' => $h, 'createdAt' => $createdAt,
    ];
}

function media_delete(array $config, PDO $pdo, string $id): void
{
    $stmt = $pdo->prepare('SELECT thumb, src FROM media WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_err('Tapylmady.', 404);

    // Only delete files that live in our uploads dir (never seed files).
    foreach ([$row['thumb'], $row['src']] as $url) {
        $rel = str_replace($config['uploads_url'], '', (string) $url);
        $path = realpath($config['uploads_dir'] . $rel);
        if ($path && str_starts_with($path, realpath($config['uploads_dir']))) {
            @unlink($path);
        }
    }
    $pdo->prepare('DELETE FROM media WHERE id = ?')->execute([$id]);
}

// --- GD helpers ---

function category_label(PDO $pdo, string $id): string
{
    $s = $pdo->prepare('SELECT label FROM categories WHERE id = ?');
    $s->execute([$id]);
    return (string) ($s->fetchColumn() ?: $id);
}

function load_gd_image(string $path, string $mime)
{
    $img = match ($mime) {
        'image/jpeg' => imagecreatefromjpeg($path),
        'image/png'  => imagecreatefrompng($path),
        'image/webp' => imagecreatefromwebp($path),
        'image/gif'  => imagecreatefromgif($path),
        default      => false,
    };
    if ($img && $mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $img = fix_exif_orientation($img, $path);
    }
    return $img;
}

function fix_exif_orientation($img, string $path)
{
    $exif = @exif_read_data($path);
    $o = $exif['Orientation'] ?? 1;
    if ($o === 3) return imagerotate($img, 180, 0);
    if ($o === 6) return imagerotate($img, -90, 0);
    if ($o === 8) return imagerotate($img, 90, 0);
    return $img;
}

function scale_to_width($img, int $width)
{
    $w = imagesx($img);
    if ($w <= $width) return imagescale($img, $w);
    return imagescale($img, $width);
}

function scale_to_max($img, int $max)
{
    $w = imagesx($img);
    $h = imagesy($img);
    if (max($w, $h) <= $max) return imagescale($img, $w);
    $scale = $max / max($w, $h);
    return imagescale($img, (int) round($w * $scale));
}

function save_poster_from_dataurl(string $dataUrl, string $dest): bool
{
    if (!preg_match('#^data:image/\w+;base64,(.+)$#', $dataUrl, $m)) return false;
    $bytes = base64_decode($m[1]);
    if ($bytes === false) return false;
    $img = imagecreatefromstring($bytes);
    if (!$img) return false;
    $scaled = scale_to_width($img, 720);
    $ok = imagewebp($scaled, $dest, 66);
    imagedestroy($img);
    if ($scaled) imagedestroy($scaled);
    return $ok;
}

function make_placeholder(string $dest, int $w, int $h): void
{
    $img = imagecreatetruecolor($w, $h);
    imagefill($img, 0, 0, imagecolorallocate($img, 28, 26, 23));
    imagewebp($img, $dest, 60);
    imagedestroy($img);
}
