#!/usr/bin/env bash
set -euo pipefail
PCL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PCL_ENV="${PCL_ENV:-prod}"
[[ "$PCL_ENV" == prod || "$PCL_ENV" == dev ]] || { echo 'Invalid environment' >&2; exit 1; }
# shellcheck source=/dev/null
source "$PCL_ROOT/environments/$PCL_ENV.env"
export AWS_PROFILE AWS_REGION AWS_DEFAULT_REGION="$AWS_REGION"
pcl_aws() { aws --profile "$AWS_PROFILE" --region "$AWS_REGION" "$@"; }
pcl_output() { pcl_aws cloudformation describe-stacks --stack-name "pacific-code-labs-$ENVIRONMENT-$1" --query "Stacks[0].Outputs[?OutputKey=='$2'].OutputValue | [0]" --output text; }
pcl_platform() {
  local cert message="${1:-}" login_version=1
  [[ "$(pcl_output login BrandingId 2>/dev/null || true)" =~ ^[a-f0-9-]{36}$ ]] && login_version=2
  cert="$(pcl_output certificates CertificateArn)"
  [[ "$cert" == arn:* ]] || { echo "Certificate stack must complete first" >&2; exit 1; }
  [[ "$(pcl_aws acm describe-certificate --certificate-arn "$cert" --query Certificate.Status --output text)" == ISSUED ]] || { echo "Certificate is not issued yet" >&2; exit 1; }
  [[ "$(pcl_aws acm describe-certificate --certificate-arn "$cert" --query "contains(Certificate.SubjectAlternativeNames, '$ADMIN_DOMAIN')" --output text)" == True ]] || { echo "Certificate must cover the configured admin domain" >&2; exit 1; }
  pcl_aws cloudformation deploy --stack-name "pacific-code-labs-$ENVIRONMENT-platform" --template-file "$PCL_ROOT/infra/platform.yml" --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --parameter-overrides "Environment=$ENVIRONMENT" "ManagedLoginVersion=$login_version" "Domain=$DOMAIN" "AdminDomain=$ADMIN_DOMAIN" "HostedZoneId=$HOSTED_ZONE_ID" "CloudFrontCertificateArn=$cert" "SesIdentityArn=$SES_IDENTITY_ARN" "SenderEmail=$SENDER_EMAIL" "CognitoDomainPrefix=$COGNITO_DOMAIN_PREFIX" "CognitoMessageArn=$message"
}
