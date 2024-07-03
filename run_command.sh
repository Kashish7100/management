#!/bin/bash

# Get the environment from the first command line argument, default to 'development'
ENV=${1:-development}

echo "Environment: $ENV"
echo "Starting npm install..."
npm install
echo "npm install complete."

echo "Installing sequelize-cli as a dev dependency..."
npm install --save-dev sequelize-cli
echo "sequelize-cli installed."

echo "Dropping the database..."
npx sequelize-cli db:drop --env $ENV
echo "Database dropped."

echo "Creating the database..."
npx sequelize-cli db:create --env $ENV
echo "Database created."

echo "Running migrations..."
npx sequelize-cli db:migrate --env $ENV
echo "Migrations complete."

echo "Seeding the database..."
if [ "$ENV" = "dev" ]; then
npx sequelize-cli db:seed:all --seeders-path seeders/dev --env $ENV
echo "Database seeding complete."
