#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
for name in landing admin; do
 if [[ -f "logs/$name.pid" ]]; then kill "$(cat "logs/$name.pid")" 2>/dev/null || true; rm "logs/$name.pid"; fi
 done
