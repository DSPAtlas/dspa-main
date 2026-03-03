#!/bin/bash

# Configuration
IMAGE_NAME="dynaprot/dspa-main-app:latest"
TAR_FILE="dspa-main-app.tar"
CONTAINER_NAME="ekrismer-webapp-1"
BACKUP_TAG="old-$(date +%Y%m%d)"
BACKUP_CONTAINER="ekrismer-webapp-backup-$(date +%Y%m%d)"

echo "--- 1. Backing up the currently running image and container ---"
# Tag current image as 'old' before we lose 'latest' reference
if docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    echo "Tagging current $IMAGE_NAME as $BACKUP_TAG"
    docker tag $IMAGE_NAME "dynaprot/dspa-main-app:$BACKUP_TAG"
fi

# To keep the old container as a backup, stop and rename it before running compose.
if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    echo "Stopping and renaming $CONTAINER_NAME to $BACKUP_CONTAINER"
    docker stop "$CONTAINER_NAME"
    docker rename "$CONTAINER_NAME" "$BACKUP_CONTAINER"
fi

echo "--- 2. Loading Docker image from $TAR_FILE ---"
if [ -f "$TAR_FILE" ]; then
    docker load < "$TAR_FILE"
else
    echo "Error: $TAR_FILE not found in current directory."
    exit 1
fi

# 3. Starting the updated webapp container
echo "--- 3. Starting the updated webapp container ---"
docker compose -p ekrismer up -d --no-deps webapp

# Fix: If it's not on webnet, attach it.
# (Note: Using 'external: true' in docker-compose.yml should do this, but let's be safe)
if ! docker inspect ekrismer-webapp-1 --format '{{json .NetworkSettings.Networks.webnet}}' | grep -qv "null"; then
    echo "Connecting ekrismer-webapp-1 to webnet..."
    docker network connect webnet ekrismer-webapp-1
    docker restart ekrismer-nginx-proxy-1
fi

echo "--- 4. Cleaning up old containers (optional) ---"
# Show current status
docker ps --filter "name=webapp"

echo "--- Done ---"
echo "If the new version fails, you can rollback by renaming the backup container or using the backup image tag."
