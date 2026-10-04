#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
cd "$PCL_ROOT"
eval "$(node scripts/load-web-config.mjs admin "$ENVIRONMENT" --print-exports)"
pnpm --filter @pcl/admin run build
if rg '__local/|git push|COGNITO_ISSUER' fe/admin/dist; then echo 'Private boundary check failed' >&2; exit 1; fi
pcl_aws s3 sync fe/admin/dist/ "s3://$ADMIN_BUCKET/" --delete --cache-control no-cache
pcl_aws cloudfront create-invalidation --distribution-id "$ADMIN_DISTRIBUTION_ID" --paths '/*'
