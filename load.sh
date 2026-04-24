#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -f .env ]; then
    set -a
    . ./.env
    set +a
fi

# Configuration
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-ekrismer}"
IMAGE_NAME="dynaprot/dspa-main-app:latest"
TAR_FILE="dspa-main-app.tar"
WEBAPP_SERVICE="webapp"
WEBAPP_CONTAINER="${PROJECT_NAME}-${WEBAPP_SERVICE}-1"
PROXY_CONTAINER="${PROJECT_NAME}-nginx-proxy-1"
BACKUP_TAG="old-$(date +%Y%m%d-%H%M%S)"

echo "--- 1. Preparing deployment directories ---"
mkdir -p cache certs vhost.d html acme

echo "--- 2. Backing up the currently tagged image ---"
if docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    echo "Tagging current $IMAGE_NAME as $BACKUP_TAG"
    docker tag "$IMAGE_NAME" "dynaprot/dspa-main-app:$BACKUP_TAG"
fi

echo "--- 3. Loading Docker image from $TAR_FILE ---"
if [ -f "$TAR_FILE" ]; then
    docker load < "$TAR_FILE"
else
    echo "Error: $TAR_FILE not found in $SCRIPT_DIR."
    exit 1
fi

echo "--- 4. Recreating the webapp container ---"
docker compose --project-name "$PROJECT_NAME" up -d --no-deps --force-recreate "$WEBAPP_SERVICE"

echo "--- 5. Ensuring the webapp is attached to webnet ---"
if ! docker inspect "$WEBAPP_CONTAINER" --format '{{json .NetworkSettings.Networks}}' | grep -q '"webnet"'; then
    echo "Connecting $WEBAPP_CONTAINER to webnet..."
    docker network connect webnet "$WEBAPP_CONTAINER"
    if docker ps --format '{{.Names}}' | grep -q "^$PROXY_CONTAINER$"; then
        docker restart "$PROXY_CONTAINER"
    fi
fi

echo "--- 6. Waiting for the webapp to start ---"
for attempt in $(seq 1 20); do
    status="$(docker inspect "$WEBAPP_CONTAINER" --format '{{.State.Status}}' 2>/dev/null || true)"
    if [ "$status" = "running" ]; then
        echo "$WEBAPP_CONTAINER is running."
        break
    fi
    sleep 1
done

if [ "${status:-}" != "running" ]; then
    echo "Error: $WEBAPP_CONTAINER did not reach the running state."
    docker compose --project-name "$PROJECT_NAME" logs --tail 200 "$WEBAPP_SERVICE" || true
    exit 1
fi

echo "--- 7. Current compose status ---"
docker compose --project-name "$PROJECT_NAME" ps

echo "--- Done ---"
echo "If the new version fails, you can rollback by retagging a backup image and redeploying it."
