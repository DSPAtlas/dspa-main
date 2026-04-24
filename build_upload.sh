#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="dynaprot/dspa-main-app:latest"
TAR_FILE="$SCRIPT_DIR/dspa-main-app.tar"
ENV_FILE="$SCRIPT_DIR/.env"
SERVER_USER="maudrius"
SERVER_IP="129.132.53.7"
SSH_KEY="$HOME/.ssh/id_ed25519"
REMOTE_DEPLOY_PATH="/home/maudrius/deploy/"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found."
    exit 1
fi

set -a
. "$ENV_FILE"
set +a

for required_var in COMPOSE_PROJECT_NAME DB_USER DB_PASSWORD DB_NAME; do
    if [ -z "${!required_var:-}" ]; then
        echo "Error: $required_var is empty in $ENV_FILE."
        exit 1
    fi
done

echo "--- 0. Cleanup"
rm -f "$TAR_FILE"

echo "--- 1. Building Docker image for linux/amd64 ---"
docker build --no-cache --platform linux/amd64 -t "$IMAGE_NAME" -f "$SCRIPT_DIR/Dockerfile" "$SCRIPT_DIR/.."

echo "--- 2. Exporting Docker image to $TAR_FILE ---"
docker save "$IMAGE_NAME" > "$TAR_FILE"

echo "--- 3. Preparing remote deploy directory ---"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "mkdir -p '$REMOTE_DEPLOY_PATH'"

echo "--- 4. Transferring files to $SERVER_IP:$REMOTE_DEPLOY_PATH ---"
scp -C -i "$SSH_KEY" \
    "$TAR_FILE" \
    "$SCRIPT_DIR/load.sh" \
    "$SCRIPT_DIR/docker-compose.yml" \
    "$SERVER_USER@$SERVER_IP:$REMOTE_DEPLOY_PATH"
scp -C -i "$SSH_KEY" "$ENV_FILE" "$SERVER_USER@$SERVER_IP:${REMOTE_DEPLOY_PATH}.env"

echo "--- 5. Executing remote deployment script ---"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd '$REMOTE_DEPLOY_PATH' && test -f .env && chmod +x load.sh && ./load.sh"

echo "--- Done ---"
