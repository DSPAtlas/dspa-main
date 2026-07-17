#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="${DSPA_MAIN_IMAGE:-dynaprot/dspa-main-app:latest}"
PLATFORM="${DSPA_MAIN_PLATFORM:-linux/amd64}"
DOCKER_BUILD_NETWORK="${DSPA_MAIN_DOCKER_BUILD_NETWORK:-host}"
NO_CACHE=0

usage() {
    cat <<EOF
Usage: $(basename "$0") [--image NAME] [--platform PLATFORM] [--no-cache]

Build the DSPA web application as a local Docker image. The image is not
exported to a tar archive and is not uploaded.

Defaults:
  image:          ${IMAGE_NAME}
  platform:       ${PLATFORM}
  build network:  ${DOCKER_BUILD_NETWORK}
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --image)
            IMAGE_NAME="${2:?--image requires a value}"
            shift
            ;;
        --platform)
            PLATFORM="${2:?--platform requires a value}"
            shift
            ;;
        --no-cache)
            NO_CACHE=1
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Error: unknown argument: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
    shift
done

required_paths=(
    "${SCRIPT_DIR}/Dockerfile"
    "${SCRIPT_DIR}/package.json"
    "${SCRIPT_DIR}/package-lock.json"
    "${PROJECT_ROOT}/dspa-backend"
    "${PROJECT_ROOT}/dspa-frontend"
    "${PROJECT_ROOT}/dspa-nightingale-bundle/nightingale-sequence"
    "${PROJECT_ROOT}/dspa-nightingale-bundle/nightingale-structure"
    "${PROJECT_ROOT}/dspa-nightingale-bundle/nightingale-track"
    "${PROJECT_ROOT}/dspa-nightingale-bundle/nightingale-sequence-heatmap"
)
for path in "${required_paths[@]}"; do
    if [ ! -e "${path}" ]; then
        echo "Error: required build input not found: ${path}" >&2
        exit 1
    fi
done

build_args=(
    --platform "${PLATFORM}"
    --network "${DOCKER_BUILD_NETWORK}"
    -f dspa-main/Dockerfile
    -t "${IMAGE_NAME}"
)
if [ "${NO_CACHE}" -eq 1 ]; then
    build_args+=(--no-cache)
fi

# The Dockerfile consumes sibling repositories. Stream only those repositories
# and omit local dependencies, dumps, and generated artifacts from the context.
context_excludes=(
    --exclude-vcs
    --exclude='.env'
    --exclude='.env.*'
    --exclude='node_modules'
    --exclude='*.log'
    --exclude='*.sql'
    --exclude='*.sql.gz'
    --exclude='*.tar'
    --exclude='coverage'
    --exclude='playwright-report'
    --exclude='test-results'
    --exclude='dspa-frontend/build'
    --exclude='dspa-main/cache'
    --exclude='dspa-main/rust'
    --exclude='dspa-main/dspa-backend'
    --exclude='dspa-main/dspa-frontend'
)
context_paths=(
    dspa-main
    dspa-backend
    dspa-frontend
    dspa-nightingale-bundle/nightingale-sequence
    dspa-nightingale-bundle/nightingale-structure
    dspa-nightingale-bundle/nightingale-track
    dspa-nightingale-bundle/nightingale-sequence-heatmap
)

echo "--- Building ${IMAGE_NAME} for ${PLATFORM} ---"
tar -C "${PROJECT_ROOT}" -cf - "${context_excludes[@]}" "${context_paths[@]}" \
    | docker build "${build_args[@]}" -

echo "--- Done ---"
echo "Local image: ${IMAGE_NAME}"
