#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
export DATA_BUCKET="$(pcl_output platform DataBucket)" MEDIA_BUCKET="$(pcl_output platform MediaBucket)" CDN_BASE_URL="https://cdn.$DOMAIN"
python3 "$PCL_ROOT/be/management-be/scripts/seed.py" --bucket "$DATA_BUCKET" --landing "$PCL_ROOT/fe/landing"
python3 "$PCL_ROOT/scripts/initialize-published.py"
