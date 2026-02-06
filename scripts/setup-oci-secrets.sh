#!/usr/bin/env bash
#
# GitHub Secrets & Variables 설정 도우미 스크립트
# 사전 조건: gh CLI 인증 완료 (gh auth login)
#
# 사용법:
#   cp .env.deploy.example .env.deploy
#   # .env.deploy 파일을 실제 값으로 수정
#   bash scripts/setup-oci-secrets.sh
#
set -euo pipefail

ENV_FILE="${1:-.env.deploy}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "오류: $ENV_FILE 파일을 찾을 수 없습니다."
  echo "먼저 .env.deploy.example을 복사하여 값을 입력하세요:"
  echo "  cp .env.deploy.example .env.deploy"
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

echo "=== GitHub Repository Variables 설정 ==="
gh variable set OCI_REGION          --body "$OCI_REGION"
gh variable set OCIR_NAMESPACE      --body "$OCIR_NAMESPACE"
gh variable set OCIR_REPO_PREFIX    --body "${OCIR_REPO_PREFIX:-one-click-publishing}"
gh variable set DEPLOY_TARGET       --body "${DEPLOY_TARGET:-compute}"

echo ""
echo "=== GitHub Repository Secrets 설정 ==="
gh secret set OCI_USERNAME          --body "$OCI_USERNAME"
gh secret set OCI_AUTH_TOKEN        --body "$OCI_AUTH_TOKEN"

# Compute 배포용
if [[ "${DEPLOY_TARGET:-compute}" == "compute" ]]; then
  echo ""
  echo "=== OCI Compute 배포 Secrets ==="
  gh secret set OCI_COMPUTE_HOST    --body "$OCI_COMPUTE_HOST"
  gh secret set OCI_COMPUTE_USER    --body "${OCI_COMPUTE_USER:-opc}"
  gh secret set OCI_SSH_PRIVATE_KEY  < "$OCI_SSH_KEY_PATH"
fi

# OKE 배포용
if [[ "${DEPLOY_TARGET:-}" == "oke" ]]; then
  echo ""
  echo "=== OKE 배포 Secrets ==="
  gh secret set OKE_CLUSTER_OCID    --body "$OKE_CLUSTER_OCID"
  gh secret set OCI_TENANCY_OCID    --body "$OCI_TENANCY_OCID"
  gh secret set OCI_USER_OCID       --body "$OCI_USER_OCID"
  gh secret set OCI_FINGERPRINT     --body "$OCI_FINGERPRINT"
  gh secret set OCI_API_PRIVATE_KEY  < "$OCI_API_KEY_PATH"
fi

echo ""
echo "설정 완료! 아래 명령으로 확인하세요:"
echo "  gh variable list"
echo "  gh secret list"
