#!/bin/bash

# Database Restore Script

# Load environment variables
source ../.env

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file.sql>"
  exit 1
fi

BACKUP_FILE=$1

# Confirm restore operation
read -p "WARNING: This will overwrite the database. Are you sure? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore cancelled."
  exit 1
fi

# Perform database restore
echo "Starting database restore from $BACKUP_FILE..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f $BACKUP_FILE

# Check if restore was successful
if [ $? -eq 0 ]; then
  echo "Restore completed successfully"
else
  echo "Restore failed"
  exit 1
fi

echo "Database restore completed"
