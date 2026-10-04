#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
if [[ "${REUSE_BUILT_IMAGE:-0}" != 1 ]]; then bash "$PCL_ROOT/scripts/build-backend-image.sh"; fi
image="$(cat "$PCL_ROOT/.deploy/$ENVIRONMENT/image-uri")"
sam deploy --template-file "$PCL_ROOT/infra/admin-api.yml" --stack-name "pacific-code-labs-$ENVIRONMENT-admin-api" --profile "$AWS_PROFILE" --region "$AWS_REGION" --resolve-s3 --image-repository "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/pacific-code-labs-management" --capabilities CAPABILITY_IAM --no-confirm-changeset --no-fail-on-empty-changeset --parameter-overrides "Environment=$ENVIRONMENT" "ImageUri=$image" "DataBucket=$(pcl_output platform DataBucket)" "MediaBucket=$(pcl_output platform MediaBucket)" "AdminPoolArn=$(pcl_output platform AdminPoolArn)" "AdminIssuer=$(pcl_output platform AdminIssuer)" "AdminClientId=$(pcl_output platform AdminClientId)" "Domain=$DOMAIN" "HostedZoneId=$HOSTED_ZONE_ID" "ApiCertificateArn=$(pcl_output certificates CertificateArn)"
