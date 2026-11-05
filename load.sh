#!/usr/bin/env bash
# Update the existing public website without changing its database or HTTPS ingress.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
[[ -f .env ]] || { echo 'The existing public website .env is required.' >&2; exit 1; }
declare -A explicit_environment=()
for variable in "${!DSPA_@}"; do
    [[ -z "$variable" ]] || explicit_environment["$variable"]="${!variable}"
done
set -a
# shellcheck source=/dev/null
source ./.env
set +a
for variable in "${!explicit_environment[@]}"; do
    export "$variable=${explicit_environment[$variable]}"
done
unset variable explicit_environment
PROJECT_NAME="${DSPA_PUBLIC_APP_PROJECT:-${COMPOSE_PROJECT_NAME:-ekrismer}}"
IMAGE_NAME=dynaprot/dspa-main-app:latest
TAR_FILE="${DSPA_PUBLIC_IMAGE_ARCHIVE:-$SCRIPT_DIR/dspa-main-app.tar}"
compose=(docker compose --project-directory "$SCRIPT_DIR" --env-file "$SCRIPT_DIR/.env"
    --project-name "$PROJECT_NAME" -f "$SCRIPT_DIR/docker-compose.yml")
[[ -f "$TAR_FILE" ]] || { echo "Missing image archive: $TAR_FILE" >&2; exit 1; }
# The full deployment may select its ingress network in a separate MCP .env.
# Retain the existing attachment when the public environment has no selection.
if [[ -z "${DSPA_EDGE_NETWORK:-}" ]]; then
    existing_container="$(docker ps -aq \
        --filter "label=com.docker.compose.project=$PROJECT_NAME" \
        --filter 'label=com.docker.compose.service=webapp')"
    if [[ -z "$existing_container" || "$existing_container" == *$'\n'* ]]; then
        echo 'Cannot identify one existing public webapp; set DSPA_EDGE_NETWORK or initialize the complete server with dspa-mcp/run_server.sh.' >&2
        exit 1
    fi
    existing_edge="$(docker inspect "$existing_container" --format \
        '{{range $name, $network := .NetworkSettings.Networks}}{{range $network.Aliases}}{{if eq . "dspa_public_webapp"}}{{println $name}}{{end}}{{end}}{{end}}')"
    if [[ -z "$existing_edge" || "$existing_edge" == *$'\n'* ]]; then
        echo 'Cannot identify one existing ingress network; set DSPA_EDGE_NETWORK or initialize the complete server with dspa-mcp/run_server.sh.' >&2
        exit 1
    fi
    DSPA_EDGE_NETWORK="$existing_edge"
fi
export DSPA_EDGE_NETWORK
"${compose[@]}" config --quiet
if ! docker network inspect "$DSPA_EDGE_NETWORK" >/dev/null 2>&1; then
    echo 'Shared ingress network is missing; initialize the complete server with dspa-mcp/run_server.sh first.' >&2
    exit 1
fi
mkdir -p cache
if docker image inspect "$IMAGE_NAME" >/dev/null 2>&1; then
    docker tag "$IMAGE_NAME" "dynaprot/dspa-main-app:old-$(date +%Y%m%d-%H%M%S)"
fi
docker load --input "$TAR_FILE"
# Network membership is declared in Compose. The shared Caddy process stays running.
"${compose[@]}" up -d --no-deps --force-recreate webapp
container="$("${compose[@]}" ps -q webapp)"
[[ -n "$container" ]] || { echo 'Public webapp container was not created.' >&2; exit 1; }
for ((attempt = 1; attempt <= 20; attempt++)); do
    status="$(docker inspect "$container" --format '{{.State.Status}}')"
    if [[ "$status" == running ]]; then
        "${compose[@]}" ps
        echo 'Public website image updated; database and shared ingress retained.'
        exit 0
    fi
    sleep 1
done
echo 'Public webapp did not reach the running state.' >&2
exit 1
