#!/bin/sh

if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <database_host> <database_name> <mysql_user> <mysql_password>"
    exit 1
fi

DATABASE_HOST=$1
DATABASE_NAME=$2
MYSQL_USER=$3
MYSQL_PASSWORD=$4

echo "Connecting to host: $DATABASE_HOST"
ping -c 3 $DATABASE_HOST

export MYSQL_PWD=$MYSQL_PASSWORD

# Check if the database exists
DB_EXISTS=$(mysql -h $DATABASE_HOST -u $MYSQL_USER -e "SHOW DATABASES LIKE '$DATABASE_NAME';" | grep "$DATABASE_NAME")

if [ "$DB_EXISTS" == "$DATABASE_NAME" ]; then
    echo "Database $DATABASE_NAME already exists. Exiting."
    exit 0
fi

# Create the database
mysql -h $DATABASE_HOST -u $MYSQL_USER -e "CREATE DATABASE $DATABASE_NAME;"

unset MYSQL_PWD

echo "Database $DATABASE_NAME created successfully."
