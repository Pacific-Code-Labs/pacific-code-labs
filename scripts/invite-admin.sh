#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
usage='Usage: invite-admin.sh email [en|es] --role platform-admin|project-manager'
email="${1:?$usage}"; shift
locale=es; role=''
while (($#)); do
  case "$1" in
    en|es) locale="$1";;
    --role) role="${2:?$usage}"; shift;;
    *) echo "$usage" >&2; exit 1;;
  esac
  shift
done
[[ "$role" == platform-admin || "$role" == project-manager ]] || { echo "$usage" >&2; exit 1; }
pool="$(pcl_output platform AdminPoolId)"
# No password passed or printed; Cognito generates and delivers the temporary password.
pcl_aws cognito-idp admin-create-user --user-pool-id "$pool" --username "$email" --desired-delivery-mediums EMAIL --user-attributes "Name=email,Value=$email" "Name=email_verified,Value=true" "Name=locale,Value=$locale" --query 'User.{Username:Username,Status:UserStatus}'
pcl_aws cognito-idp admin-add-user-to-group --user-pool-id "$pool" --username "$email" --group-name "$role"
echo "Added $email to $role"
