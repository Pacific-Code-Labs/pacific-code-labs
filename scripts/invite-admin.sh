#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
email="${1:?Usage: invite-admin.sh email [en|es]}"; locale="${2:-es}"
[[ "$locale" == es || "$locale" == en ]] || { echo 'Locale must be en or es' >&2; exit 1; }
# No password passed or printed; Cognito generates and delivers the temporary password.
pcl_aws cognito-idp admin-create-user --user-pool-id "$(pcl_output platform AdminPoolId)" --username "$email" --desired-delivery-mediums EMAIL --user-attributes "Name=email,Value=$email" "Name=email_verified,Value=true" "Name=locale,Value=$locale" --query 'User.{Username:Username,Status:UserStatus}'
