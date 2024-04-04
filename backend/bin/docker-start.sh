#!/bin/sh
printenv

echo "Waiting 1m for DB image to start"
sleep 1m

echo "Crating database..."
./bin/create-database.sh "$MYSQL_HOST" "$MYSQL_DB" "$MYSQL_USER" "$MYSQL_PASSWORD"

# migrate DB
echo "Starting migration!"
npm run db-upgrade:ci

pm2 start pm2.config.js --attach
