<?php
/**
 * Copy this file to config.php and fill in your own values.
 *   cp config.sample.php config.php
 *   php tools/set-password.php "your-admin-password"   # sets admin_pass_hash
 *
 * config.php is gitignored — never commit real secrets.
 */
return [
    'admin_user'      => 'admin',
    // bcrypt hash of your admin password (generate with tools/set-password.php)
    'admin_pass_hash' => 'PUT_BCRYPT_HASH_HERE',
    // random 64-char hex string, unique per deployment (e.g. bin2hex(random_bytes(32)))
    'app_secret'      => 'PUT_A_RANDOM_SECRET_HERE',

    'token_ttl'       => 60 * 60 * 24 * 7, // 7 days

    // Allowed browser origins for CORS (dev only). Empty = same-origin (production).
    'cors_origins'    => [],

    'max_upload_bytes' => 64 * 1024 * 1024, // 64 MB

    'db_path'      => __DIR__ . '/data/smm.sqlite',
    'uploads_dir'  => __DIR__ . '/uploads',
    'uploads_url'  => '/api/uploads',

    'allowed_types' => [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        'video/mp4'  => 'mp4',
        'video/webm' => 'webm',
        'video/quicktime' => 'mov',
    ],
];
