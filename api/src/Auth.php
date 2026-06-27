<?php
/** Authentication: password login -> signed token, and token guard. */

function auth_login(array $config, string $username, string $password): string
{
    // Constant-ish work whether or not the user matches.
    $userOk = hash_equals($config['admin_user'], $username);
    $passOk = password_verify($password, $config['admin_pass_hash']);
    if (!$userOk || !$passOk) {
        json_err('Ulanyjy ady ýa-da açar sözi nädogry.', 401);
    }
    $payload = [
        'sub' => $username,
        'iat' => time(),
        'exp' => time() + $config['token_ttl'],
    ];
    return token_sign($payload, $config['app_secret']);
}

/** Require a valid Bearer token; exits 401 otherwise. Returns the payload. */
function require_auth(array $config): array
{
    $token = bearer_token();
    if (!$token) json_err('Awtorizasiýa talap edilýär.', 401);
    $payload = token_verify($token, $config['app_secret']);
    if (!$payload) json_err('Sessiýa möhleti gutardy ýa-da nädogry.', 401);
    return $payload;
}
