#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
repo=Pacific-Code-Labs/pacific-code-labs-admin
subject="$(gh api "repos/$repo/actions/oidc/customization/sub" --jq .sub_claim_prefix)"
[[ -n "$subject" && "$subject" != null ]] || subject="repo:$repo"
pcl_aws cloudformation deploy --stack-name "pacific-code-labs-$ENVIRONMENT-admin-publish" --template-file "$PCL_ROOT/infra/admin-publish-role.yml" --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --parameter-overrides "Repository=$repo" "OidcSubjectPrefix=$subject" "Environment=$ENVIRONMENT" "AdminBucket=$(pcl_output platform AdminBucket)" "DistributionId=$(pcl_output platform AdminDistribution)"
gh api --method PUT "repos/$repo/environments/$ENVIRONMENT" --silent
pcl_output admin-publish RoleArn | gh secret set AWS_ADMIN_PUBLISH_ROLE_ARN --repo "$repo" --env "$ENVIRONMENT"
gh variable set AWS_REGION --body "$AWS_REGION" --repo "$repo" --env "$ENVIRONMENT"
