#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
# Preserve existing custom-message wiring on repeat deployments.
message="$(pcl_output email CustomMessageArn 2>/dev/null || true)"
[[ "$message" == None ]] && message=''
pcl_platform "$message"
