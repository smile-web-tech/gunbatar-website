<?php
/**
 * Change the SMM admin password.
 *   php tools/set-password.php "new-strong-password"
 * Prints the new bcrypt hash and updates config.php in place.
 */
if ($argc < 2 || strlen($argv[1]) < 6) {
    fwrite(STDERR, "Usage: php tools/set-password.php \"new-password\" (min 6 chars)\n");
    exit(1);
}
$hash = password_hash($argv[1], PASSWORD_DEFAULT);
$configPath = __DIR__ . '/../config.php';
$src = file_get_contents($configPath);
$new = preg_replace(
    "/('admin_pass_hash'\\s*=>\\s*)'[^']*'/",
    "$1'" . str_replace('$', '\\$', $hash) . "'",
    $src,
    1,
    $count
);
if ($count === 1 && $new !== null) {
    file_put_contents($configPath, $new);
    echo "Updated config.php with new password hash.\n";
} else {
    echo "Could not auto-update config.php. Set admin_pass_hash manually to:\n$hash\n";
}
