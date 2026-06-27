<?php
/** SMM API front controller. */

declare(strict_types=1);

$config = require __DIR__ . '/config.php';
require __DIR__ . '/src/helpers.php';
require __DIR__ . '/src/Db.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/Media.php';
require __DIR__ . '/src/Teachers.php';

apply_cors($config);

// Normalize the request path (works behind Apache /api rewrite or php -S).
$uri  = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = $uri;
if (str_starts_with($path, '/api')) $path = substr($path, 4);
$path = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = db($config);

    // --- Public routes ---
    if ($path === '/' || $path === '/health') {
        json_out(['ok' => true, 'service' => 'smm-api']);
    }
    if ($path === '/categories' && $method === 'GET') {
        json_out(['categories' => categories_list($pdo)]);
    }
    if ($path === '/media' && $method === 'GET') {
        json_out(['media' => media_list($pdo)]);
    }
    if ($path === '/teachers' && $method === 'GET') {
        json_out(['teachers' => teachers_list($pdo)]);
    }
    if ($path === '/login' && $method === 'POST') {
        $body = read_json_body();
        $token = auth_login($config, (string) ($body['username'] ?? ''), (string) ($body['password'] ?? ''));
        json_out(['token' => $token]);
    }

    // --- Protected routes ---
    if ($path === '/media' && $method === 'POST') {
        require_auth($config);
        json_out(['media' => media_create($config, $pdo)], 201);
    }
    if (preg_match('#^/media/([\w-]+)$#', $path, $m) && $method === 'DELETE') {
        require_auth($config);
        media_delete($config, $pdo, $m[1]);
        json_out(['ok' => true]);
    }
    if ($path === '/teachers' && $method === 'POST') {
        require_auth($config);
        json_out(['teacher' => teacher_create($config, $pdo)], 201);
    }
    if (preg_match('#^/teachers/([\w-]+)$#', $path, $m) && $method === 'DELETE') {
        require_auth($config);
        teacher_delete($config, $pdo, $m[1]);
        json_out(['ok' => true]);
    }

    json_err('Tapylmady: ' . $path, 404);
} catch (Throwable $e) {
    json_err('Serwer säwligi.', 500);
}
