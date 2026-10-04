#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/deploy-common.sh"
repo=pacific-code-labs-management
uri="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo"
if ! pcl_aws ecr describe-repositories --repository-names "$repo" >/dev/null 2>&1; then pcl_aws ecr create-repository --repository-name "$repo" --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true >/dev/null; fi
pcl_aws ecr get-login-password | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
tag="${IMAGE_TAG:-prod-$(date -u +%Y%m%dT%H%M%SZ)}"
docker buildx build --platform linux/arm64 --provenance=false --load -t "$uri:$tag" "$PCL_ROOT/be/management-be"
docker push "$uri:$tag"
digest="$(pcl_aws ecr describe-images --repository-name "$repo" --image-ids "imageTag=$tag" --query 'imageDetails[0].imageDigest' --output text)"
mkdir -p "$PCL_ROOT/.deploy/$ENVIRONMENT"
printf '%s\n' "$uri@$digest" > "$PCL_ROOT/.deploy/$ENVIRONMENT/image-uri"
