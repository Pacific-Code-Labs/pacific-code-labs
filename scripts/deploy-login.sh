#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
python3 "$PCL_ROOT/infra/login/build-template.py"
pcl_aws cloudformation deploy --stack-name "pacific-code-labs-$ENVIRONMENT-login" --template-file "$PCL_ROOT/infra/login/template.yml" --no-fail-on-empty-changeset --parameter-overrides "UserPoolId=$(pcl_output platform AdminPoolId)" "ClientId=$(pcl_output platform AdminClientId)"
pcl_platform "$(pcl_output email CustomMessageArn)"
