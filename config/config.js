require('dotenv').config()

module.exports = {
  // development: {
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST,
  //   dialect: process.env.DIALECT,
  //   port: process.env.DB_PORT,
  //   seederStorage: 'sequelize',
  //   seederStorageTableName: 'SequelizeSeeders',
  //   seederStorageTableOptions: {},
  //   seederPaths: ['./seeders/dev'],
  // },
  // test: {
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST,
  //   dialect: process.env.DIALECT,
  //   seederStorage: 'sequelize',
  //   seederStorageTableName: 'SequelizeSeeders',
  //   seederStorageTableOptions: {},
  //   seederPaths: ['./seeders/test'],
  // },
  // production: {
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST,
  //   dialect: process.env.DIALECT,
  //   seederStorage: 'sequelize',
  //   seederStorageTableName: 'SequelizeSeeders',
  //   seederStorageTableOptions: {},
  //   seederPaths: ['./seeders/production'],
  // },

  development: {
    username: "root",
    password: "Kashish@1234",
    database: "db_felda",
    host: "127.0.0.1",
    dialect: "mysql",
    port: "3306",
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeders',
    seederStorageTableOptions: {},
    seederPaths: ['./seeders/dev'],
  },
  test: {
    username: "root",
    password: "Kashish@1234",
    database: "test_db_felda",
    host: "127.0.0.1",
    dialect: "mysql",
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeders',
    seederStorageTableOptions: {},
    seederPaths: ['./seeders/test'],
  },
  production: {
    username: "root",
    password: "Kashish@1234",
    database: "prod_db_felda",
    host: "127.0.0.1",
    dialect: "mysql",
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeeders',
    seederStorageTableOptions: {},
    seederPaths: ['./seeders/production'],
  },
}