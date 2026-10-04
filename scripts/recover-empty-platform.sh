#!/usr/bin/env bash
# Recover only a failed initial deployment, before users or records exist.
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
stack="pacific-code-labs-$ENVIRONMENT-platform"
status="$(pcl_aws cloudformation describe-stacks --stack-name "$stack" --query 'Stacks[0].StackStatus' --output text)"
[[ "$status" == ROLLBACK_FAILED || "$status" == ROLLBACK_COMPLETE ]] || { echo 'Recovery applies only to a failed initial stack.' >&2; exit 1; }
pool="$(pcl_aws cloudformation describe-stack-resources --stack-name "$stack" --query "StackResources[?LogicalResourceId=='AdminPool'].PhysicalResourceId | [0]" --output text)"
if [[ "$pool" != None ]]; then
  users="$(pcl_aws cognito-idp list-users --user-pool-id "$pool" --query 'length(Users)' --output text)"
  [[ "$users" == 0 ]] || { echo 'Pool has users. Recovery stopped.' >&2; exit 1; }
  pcl_aws cognito-idp update-user-pool --user-pool-id "$pool" --deletion-protection INACTIVE
fi
# S3 buckets are retained by CloudFormation; this command cannot erase content.
pcl_aws cloudformation delete-stack --stack-name "$stack"
pcl_aws cloudformation wait stack-delete-complete --stack-name "$stack"
bash "$PCL_ROOT/scripts/deploy-platform.sh"
