#!/bin/bash

# db_backup.sh
# This script creates a MySQL database dump of the DSPA database.
# The output file is named with the current timestamp: dynaprotdb.yyyy.mm.dd.hh.mm.sql

# 1. Define the timestamp format (yyyy.mm.dd.hh.mm)
TIMESTAMP=$(date +"%Y.%m.%d.%H.%M")

# 2. Define the output file name using the timestamp
OUTPUT_FILE="dynaprotdb.${TIMESTAMP}.sql"

# 3. Database configuration (from MINIMAL_RUN.md defaults)
DB_USER="root"
DB_PASSWORD="dspa"
DB_NAME="dynaprotdbv2"

echo "Starting database backup for ${DB_NAME}..."

# 4. Execute the mysqldump command
# -u specifies the username
# -p specifies the password (no space between -p and the password)
# The output is redirected to the OUTPUT_FILE
mysqldump -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" > "${OUTPUT_FILE}"

# 5. Check the exit status of the mysqldump command to ensure it was successful
if [ $? -eq 0 ]; then
  echo "Backup successfully created: ${OUTPUT_FILE}"
else
  echo "Error: Database backup failed!" >&2
  exit 1
fi
