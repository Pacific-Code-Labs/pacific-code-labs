#!/usr/bin/env bash
set -euo pipefail
export PCL_ENV="${1:-prod}"
step="${2:-all}"
root="$(cd "$(dirname "$0")" && pwd)"
if [[ "$step" == --plan ]]; then
  printf '%s\n' "Environment: $PCL_ENV" 'Order: certificates -> platform -> email + pool wiring -> backend -> branded login -> seed -> admin' 'Uses environments/<environment>.env; no database, no secrets in source.'
  exit 0
fi
if [[ "$step" == all ]]; then
  for current in certificates platform email backend login; do bash "$root/scripts/deploy-$current.sh"; done
  bash "$root/scripts/seed-content.sh"
  bash "$root/scripts/publish-admin.sh"
else
  case "$step" in certificates|platform|email|backend|login|publish-role) bash "$root/scripts/deploy-$step.sh";; seed) bash "$root/scripts/seed-content.sh";; admin) bash "$root/scripts/publish-admin.sh";; *) echo 'Unknown deployment step' >&2; exit 1;; esac
fi
