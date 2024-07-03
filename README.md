# My React Application

This is a simple React application.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v10 or higher)

## Prerequisites Installation

1. **Node.js:** If you don't have Node.js installed, download and install it from the [official Node.js website](https://nodejs.org/).

2. **npm:** npm is included with Node.js. However, it's a good practice to update npm to the latest version using the following command:
   ```sh
   npm install -g npm@latest
   ```

## Clone the Repository

1. Use the below command to clone the repository
   ```bash
   git clone https://HectadataMalaysia@dev.azure.com/HectadataMalaysia/FELDA/_git/Felda_UserManagement -o upstream
   ```

## Installation and Setup Instructions

1. Navigate to the project directory:

   ```bash
   cd your-repo

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Install dependencies sequelize cli for migration and seeder command:

   ```bash
   npm install --save-dev sequelize-cli

   ```

4. Update the config.json file as below based on your mysql credentials:

   ```bash
   {
     "development": {
       "username": "root",
       "password": "",
       "database": "db_felda",
       "host": "127.0.0.1",
       "dialect": "mysql",
       "port":"3306"
     }}

   ```

5. Create the database:

   ```bash
   npx sequelize-cli db:create

   ```

6. Run the migration to create tables:

   ```bash
   npx sequelize-cli db:migrate

   ```

7. Run the seeder to load initial data:

   ```bash
   npx sequelize-cli db:seed:all

   ```

8. Run the server
   ```bash
       node server.js
   ```

## Accessing the Application

Open your browser and navigate to http://localhost:4200 to view the application.

## Debugger Setup for vscode

1. Click on the debugger icon on the left side of the vs code and create a launch.json
2. copy the below setup into the file
   ```bash
           {
               "version": "0.2.0",
               "configurations": [
                   {
                       "type": "node",
                       "request": "launch",
                       "name": "Launch Program with Nodemon",
                       "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/nodemon",
                       "program": "${workspaceFolder}/server.js",
                       "restart": true,
                       "console": "integratedTerminal",
                       "internalConsoleOptions": "neverOpen",
                       "skipFiles": [
                           "<node_internals>/**"
                       ],
                       "args": ["--delay", "1"], // Optional delay in seconds before restart
                       "env": {
                           "NODE_ENV": "development"
                       }
                   }
               ]
           }
   ```
3. Run the debugger

## Pretify the files (to format all the files in the project)

1. npm command to run

   ```bash
           npx prettier --write "**/*.{js,json,css,md}"

   ```

## useful CLI command for migration

1. Create model

   ```bash
           npx sequelize-cli model:generate --name User

   ```

2. Create migration

   ```bash
           npx sequelize-cli migration:generate --name migration-example

   ```

3. Runing Migration

   ```bash
   npx sequelize-cli db:migrate

   ```

4. Create seeder

   ```bash
   npx sequelize-cli seed:generate --name demo-user

   ```

5. Runing Seeder

   ```bash
   npx sequelize-cli db:seed:all
   npx sequelize-cli db:seed --seed name-of-seed-as-in-data

   ```

6. To run development seeder with default Data

   ```bash
   npx sequelize-cli db:seed:all --seeders-path seeders/dev --env development
   ```

7. Reload Database

   ```bash
           npm run reloadDb

   ```

   passs the parameter dev to load the development seeder as well

   ```bash
           npm run reloadDb dev

   ```
