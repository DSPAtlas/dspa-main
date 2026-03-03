#!/bin/bash

# db_backup.sh
# This script creates a MySQL database dump of the DSPA database.
# The output file is named with the current timestamp: dynaprotdb.yyyy.mm.dd.hh.mm.sql

# 1. Define the timestamp format (yyyy.mm.dd.hh.mm)
TIMESTAMP=$(date +"%Y.%m.%d.%H.%M")

# 2. Put backups into a dedicated subfolder next to this script.
# We resolve the script directory so the backup location is stable
# regardless of where you run the script from.
SCRIPT_DIR="/home/dynaprot"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Create the folder if it doesn't exist yet.
mkdir -p "${BACKUP_DIR}"

# 3. Define the output file name using the timestamp
OUTPUT_FILE="${BACKUP_DIR}/dynaprotdb.${TIMESTAMP}.sql"

# 4. Database configuration (from MINIMAL_RUN.md defaults)
DB_USER="root"
DB_PASSWORD="dspa"
DB_NAME="dynaprotdbv2"

# IMPORTANT:
# By default, MySQL client tools may try to connect via a local Unix socket.
# In our use-case the database runs in Docker and is reachable over TCP (port 3306),
# so we force TCP by providing host/port (and --protocol=tcp).
#
# You can override these via environment variables when running the script:
#   DB_HOST=127.0.0.1 DB_PORT=3306 ./db_backup.sh
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3307}"

echo "Starting database backup for ${DB_NAME}..."

# 5. Execute the mysqldump command
# -h / -P specify host and port (forces TCP; avoids local socket)
# --protocol=tcp explicitly selects TCP
# -u specifies the username
# -p specifies the password (no space between -p and the password)
# The output is redirected to the OUTPUT_FILE
mysqldump \
  --protocol=tcp \
  -h "${DB_HOST}" \
  -P "${DB_PORT}" \
  -u "${DB_USER}" \
  -p"${DB_PASSWORD}" \
  "${DB_NAME}" \
  > "${OUTPUT_FILE}"

# 6. Check the exit status of the mysqldump command to ensure it was successful
if [ $? -eq 0 ]; then
  echo "Backup successfully created: ${OUTPUT_FILE}, zipping"
  ls -l -h ${OUTPUT_FILE}
  gzip ${OUTPUT_FILE}
  ls -l -h ${OUTPUT_FILE}.gz
else
  echo "Error: Database backup failed!" >&2
  exit 1
fi
