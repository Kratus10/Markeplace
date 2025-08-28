#!/bin/bash

# Database Backup Script

# Load environment variables
source ../.env

# Set default values if not provided
BACKUP_DIR=${BACKUP_DIR:-"./backups"}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform database backup
echo "Starting database backup..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_FILE"
else
  echo "Backup failed"
  exit 1
fi

# Apply retention policy
echo "Applying retention policy (keeping backups for $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "backup_*.sql" -type f -mtime +$RETENTION_DAYS -exec rm -f {} \;

# Optional: Upload to cloud storage
if [ -n "$BACKUP_S3_BUCKET" ]; then
  echo "Uploading backup to S3 bucket: $BACKUP_S3_BUCKET"
  aws s3 cp $BACKUP_FILE s3://$BACKUP_S3_BUCKET/
fi

echo "Backup process completed"
