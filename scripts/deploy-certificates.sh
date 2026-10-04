#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
[[ "$AWS_REGION" == us-east-1 ]] || { echo 'CloudFront certificate stack must be deployed in us-east-1' >&2; exit 1; }
pcl_aws cloudformation deploy --stack-name "pacific-code-labs-$ENVIRONMENT-certificates" --template-file "$PCL_ROOT/infra/certificates.yml" --no-fail-on-empty-changeset --parameter-overrides "Domain=$DOMAIN" "AdminDomain=$ADMIN_DOMAIN" "AuthDomain=$AUTH_DOMAIN" "HostedZoneId=$HOSTED_ZONE_ID"
