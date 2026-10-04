#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
cd "$root"
mkdir -p logs
# Processes started by this workspace only; never kill unrelated port owners.
for name in landing admin; do
  file="logs/$name.pid"
  if [[ -f "$file" ]]; then kill "$(cat "$file")" 2>/dev/null || true; fi
 done
PORT="${LANDING_PORT:-5183}" nohup pnpm --filter @pcl/landing run dev > logs/landing.log 2>&1 &
echo $! > logs/landing.pid
if [[ "${LOAD_ADMIN_SSM:-0}" == 1 ]]; then
  export AWS_PROFILE="${AWS_PROFILE:-PACIFIC-PROD}" AWS_REGION="${AWS_REGION:-us-east-1}"
  eval "$(node scripts/load-web-config.mjs admin prod --print-exports)"
fi
PORT="${ADMIN_PORT:-5185}" nohup pnpm --filter @pcl/admin run dev > logs/admin.log 2>&1 &
echo $! > logs/admin.pid
printf '%s\n' 'Landing: http://127.0.0.1:5183' 'Admin: http://127.0.0.1:5185' 'Use LOAD_ADMIN_SSM=1 to sign in locally through production Cognito.'
