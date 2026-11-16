#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
usage='Usage: assign-admin-role.sh email platform-admin|project-manager'
email="${1:?$usage}"; role="${2:?$usage}"
[[ "$role" == platform-admin || "$role" == project-manager ]] || { echo "$usage" >&2; exit 1; }
pool="$(pcl_output platform AdminPoolId)"
pcl_aws cognito-idp admin-add-user-to-group --user-pool-id "$pool" --username "$email" --group-name "$role"
for other in platform-admin project-manager; do
  [[ "$other" == "$role" ]] || pcl_aws cognito-idp admin-remove-user-from-group --user-pool-id "$pool" --username "$email" --group-name "$other"
done
pcl_aws cognito-idp admin-list-groups-for-user --user-pool-id "$pool" --username "$email" --query 'Groups[].GroupName' --output text
