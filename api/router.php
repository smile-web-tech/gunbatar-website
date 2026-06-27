<?php
/**
 * Dev router for the PHP built-in server:
 *   php -S localhost:8080 -t api api/router.php
 * Serves existing static files (uploads) directly, routes everything else to
 * the API front controller. Apache uses .htaccess instead (this file is unused
 * in production).
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $path;
if ($path !== '/' && is_file($file)) {
    return false; // let the built-in server serve the static file
}
require __DIR__ . '/index.php';
