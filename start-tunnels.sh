#!/usr/bin/env bash
#
# Start both projects + their tunnels and print the two public URLs.
#   ./start-tunnels.sh         start everything, print URLs
#   ./start-tunnels.sh stop    stop the tunnels + dev servers
#
# - ozgerish-dashboard  -> ngrok  (your fixed static domain)
# - Günbatar Şapagy     -> Cloudflare quick tunnel (fresh random URL each run)

set -uo pipefail

GUNBATAR="/home/ysmayyl/StudioProjects/gunbatar"
OZGERISH="/home/ysmayyl/StudioProjects/ozgerish-dashboard"
LOGDIR="$HOME/.gunbatar-tunnels"
mkdir -p "$LOGDIR"

NGROK="$(command -v ngrok || echo "$HOME/.local/bin/ngrok")"
CLOUDFLARED="$(command -v cloudflared || echo "$HOME/.local/bin/cloudflared")"

GUN_PORT=5180   # gunbatar vite (pinned in vite.config.ts)
OZG_PORT=5173   # ozgerish vite (default)
API_PORT=8080   # gunbatar PHP API

up()  { curl -fsS -o /dev/null -m 2 "http://localhost:$1/" 2>/dev/null; }

if [[ "${1:-}" == "stop" ]]; then
  pkill -f "cloudflared tunnel --url http://localhost:$GUN_PORT" 2>/dev/null
  pkill -f "ngrok start"                                        2>/dev/null
  pkill -f "localhost:$API_PORT -t api"                         2>/dev/null
  pkill -f "vite.*--host"                                       2>/dev/null
  echo "Stopped tunnels + dev servers."
  exit 0
fi

# --- helper: start a backgrounded server in $1 (dir) if its port is down ---
start_server() { # name  port  dir  command...
  local name="$1" port="$2" dir="$3"; shift 3
  if up "$port"; then
    echo "  ✓ $name already running on :$port"
    return
  fi
  echo "  ▶ starting $name on :$port ..."
  ( cd "$dir" && nohup "$@" >"$LOGDIR/$name.log" 2>&1 & )
  for _ in $(seq 1 40); do up "$port" && break; sleep 1; done
  up "$port" && echo "    up." || echo "    ⚠ $name didn't come up — see $LOGDIR/$name.log"
}

echo "Local servers:"
start_server "ozgerish" "$OZG_PORT" "$OZGERISH" pnpm dev
start_server "gunbatar-api" "$API_PORT" "$GUNBATAR" \
  php -d upload_max_filesize=64M -d post_max_size=72M -d max_execution_time=120 \
      -S localhost:$API_PORT -t api api/router.php
start_server "gunbatar-web" "$GUN_PORT" "$GUNBATAR/web" npm run dev

echo ""
echo "Tunnels:"
# ngrok (ozgerish) — only one ngrok agent is allowed, so reuse if already up
if pgrep -f "ngrok start" >/dev/null || curl -fsS -o /dev/null -m 2 http://localhost:4040 2>/dev/null; then
  echo "  ✓ ngrok already running"
else
  echo "  ▶ starting ngrok (ozgerish) ..."
  nohup "$NGROK" start other --log=stdout >"$LOGDIR/ngrok.log" 2>&1 &
  sleep 4
fi

# cloudflared (gunbatar) — always fresh
pkill -f "cloudflared tunnel --url http://localhost:$GUN_PORT" 2>/dev/null
echo "  ▶ starting Cloudflare tunnel (gunbatar) ..."
nohup "$CLOUDFLARED" tunnel --url "http://localhost:$GUN_PORT" --no-autoupdate \
  >"$LOGDIR/cloudflared.log" 2>&1 &

# --- collect URLs ---
NGROK_URL=""
for _ in $(seq 1 20); do
  NGROK_URL="$(curl -fsS -m 2 http://localhost:4040/api/tunnels 2>/dev/null \
    | python3 -c 'import json,sys
d=json.load(sys.stdin); ts=d.get("tunnels",[])
print(next((t["public_url"] for t in ts if t.get("name")=="other"), ts[0]["public_url"] if ts else ""))' 2>/dev/null)"
  [ -n "$NGROK_URL" ] && break; sleep 1
done

CF_URL=""
for _ in $(seq 1 30); do
  CF_URL="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOGDIR/cloudflared.log" 2>/dev/null | head -1)"
  [ -n "$CF_URL" ] && break; sleep 1
done

echo ""
echo "────────────────────────────────────────────────────────────"
printf "  ozgerish-dashboard : %s\n" "${NGROK_URL:-<not ready — check $LOGDIR/ngrok.log>}"
printf "  Günbatar Şapagy    : %s\n" "${CF_URL:-<not ready — check $LOGDIR/cloudflared.log>}"
echo "────────────────────────────────────────────────────────────"
echo "Tunnels run in the background. Stop with:  ./start-tunnels.sh stop"
