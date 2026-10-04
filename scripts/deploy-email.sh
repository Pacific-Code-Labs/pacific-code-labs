#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
pool="$(pcl_output platform AdminPoolArn)"
sam build --template-file "$PCL_ROOT/infra/email/template.yml" --build-dir "$PCL_ROOT/infra/email/.aws-sam/build"
sam deploy --template-file "$PCL_ROOT/infra/email/.aws-sam/build/template.yaml" --stack-name "pacific-code-labs-$ENVIRONMENT-email" --profile "$AWS_PROFILE" --region "$AWS_REGION" --resolve-s3 --capabilities CAPABILITY_IAM --no-confirm-changeset --no-fail-on-empty-changeset --parameter-overrides "Environment=$ENVIRONMENT" "UserPoolArn=$pool" "AdminUrl=https://admin.$DOMAIN"
pcl_platform "$(pcl_output email CustomMessageArn)"
