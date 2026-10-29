#!/bin/sh
set -eu

credential_file="${DSPA_WEBAPP_CREDENTIAL_FILE:-/etc/dspa-db/webapp.env}"
# shellcheck disable=SC1090
. "$credential_file"
export DB_USER DB_NAME DB_PASSWORD DB_USER_CONTEXT_MODE
export DSPA_IDENTITY_DB_USER DSPA_IDENTITY_DB_PASSWORD
export DSPA_CONTEXT_DB_USER DSPA_CONTEXT_DB_PASSWORD DSPA_WEBAPP_GATEWAY_TOKEN
exec "$@"
