#!/usr/bin/env bash
set -euo pipefail
umask 077
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME=dynaprot/dspa-main-app:latest
TAR_FILE="$SCRIPT_DIR/dspa-main-app.tar"
SERVER_USER="${DSPA_SERVER_USER:-maudrius}"
SERVER_HOST="${DSPA_SERVER_HOST:-129.132.53.7}"
SSH_KEY="${DSPA_SSH_KEY:-$HOME/.ssh/id_ed25519}"
REMOTE_DIR="${DSPA_PUBLIC_APP_DIR:-/home/maudrius/deploy}"
BUILD_ONLY=0
usage() {
    cat <<'EOF'
Usage: ./build_upload.sh [--build-only]
Build/export the public root frontend and update the existing public website.
The existing remote .env, database volume, and shared Caddy ingress are retained.
Initialize the complete server with dspa-mcp/build_upload_server.sh before using
this website-only updater. --build-only performs no remote access.
EOF
}
while [[ $# -gt 0 ]]; do
    case "$1" in
        --build-only) BUILD_ONLY=1 ;;
        -h|--help) usage; exit 0 ;;
        *) usage >&2; exit 2 ;;
    esac
    shift
done
REMOTE_DIR="${REMOTE_DIR%/}"
[[ "$REMOTE_DIR" =~ ^/[A-Za-z0-9_./-]+$ && "$REMOTE_DIR" != / && "/${REMOTE_DIR#/}/" != *'/../'* && "/${REMOTE_DIR#/}/" != *'/./'* ]] || {
    echo 'Invalid public deployment path.' >&2; exit 2;
}
[[ "$SERVER_USER" =~ ^[A-Za-z0-9_-]+$ && "$SERVER_HOST" =~ ^[A-Za-z0-9.-]+$ && "$SERVER_HOST" != -* ]] || {
    echo 'Invalid SSH user or host.' >&2; exit 2;
}
bash "$SCRIPT_DIR/build_docker_image.sh" --image "$IMAGE_NAME" --base-path /
docker save --output "$TAR_FILE" "$IMAGE_NAME"
if [[ "$BUILD_ONLY" == 1 ]]; then
    printf 'Public image exported to %s; no remote access performed.\n' "$TAR_FILE"
    exit 0
fi
remote="$SERVER_USER@$SERVER_HOST"
ssh -i "$SSH_KEY" "$remote" bash -s -- "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
[[ -f "$1/.env" ]] || { echo 'Existing public website .env is missing.' >&2; exit 1; }
REMOTE
scp -C -i "$SSH_KEY" "$TAR_FILE" "$SCRIPT_DIR/load.sh" "$SCRIPT_DIR/docker-compose.yml" "$remote:$REMOTE_DIR/"
ssh -i "$SSH_KEY" "$remote" bash -s -- "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
cd "$1"
chmod +x load.sh
./load.sh
REMOTE
