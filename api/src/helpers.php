<?php
/** Small helpers: JSON I/O, CORS, and HMAC token sign/verify. */

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_err(string $message, int $status = 400): void
{
    json_out(['error' => $message], $status);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function apply_cors(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $config['cors_origins'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 86400');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function base64url_encode(string $s): string
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function base64url_decode(string $s): string
{
    return base64_decode(strtr($s, '-_', '+/'));
}

/** Create a signed token: base64url(payload).base64url(hmac). */
function token_sign(array $payload, string $secret): string
{
    $body = base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES));
    $sig  = hash_hmac('sha256', $body, $secret, true);
    return $body . '.' . base64url_encode($sig);
}

/** Verify a signed token; returns payload array or null. */
function token_verify(string $token, string $secret): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 2) return null;
    [$body, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', $body, $secret, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(base64url_decode($body), true);
    if (!is_array($payload)) return null;
    if (($payload['exp'] ?? 0) < time()) return null;
    return $payload;
}

function bearer_token(): ?string
{
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($hdr === '' && function_exists('apache_request_headers')) {
        $h = apache_request_headers();
        $hdr = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+(.+)/i', $hdr, $m)) return trim($m[1]);
    return null;
}
