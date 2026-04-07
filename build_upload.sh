#!/bin/bash

# Define variables
IMAGE_NAME="dynaprot/dspa-main-app:latest"
TAR_FILE="dspa-main-app.tar"
SERVER_USER="maudrius"
SERVER_IP="129.132.53.7"
SSH_KEY="$HOME/.ssh/id_ed25519"
REMOTE_DEPLOY_PATH="/home/maudrius/deploy/"

echo "--- 0. Cleanup"
rm -f $TAR_FILE

echo "--- 1. Building Docker image for linux/amd64 ---"

# Build from the project root (..) but use the Dockerfile in dspa-main
docker build --no-cache --platform linux/amd64 -t $IMAGE_NAME -f Dockerfile ..

echo "--- 2. Exporting Docker image to $TAR_FILE ---"
docker save $IMAGE_NAME > $TAR_FILE

echo "--- 3. Preparing remote deploy directory ---"
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DEPLOY_PATH"

echo "--- 4. Transferring files to $SERVER_IP:$REMOTE_DEPLOY_PATH ---"
# Using compressed scp to speed up the transfer of the large tar file
scp -C -i $SSH_KEY $TAR_FILE load.sh docker-compose.yml .env $SERVER_USER@$SERVER_IP:$REMOTE_DEPLOY_PATH

echo "--- 5. Executing remote deployment script ---"
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "cd $REMOTE_DEPLOY_PATH && chmod +x load.sh && ./load.sh"

echo "--- Done ---"
