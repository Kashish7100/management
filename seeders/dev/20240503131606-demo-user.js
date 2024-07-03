'use strict'

/** @type {import('sequelize-cli').Migration} */

const { associateRolesAndPermissions } = require('./utils/rolesAndPermission')
const { QueryTypes } = require('sequelize')

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     *
     */
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          fullname: 'superadmin',
          username: 'superadmin',
          emailId: 'superadmin@app.com',
          password: 'password',
          isActive: '0',
          isLogin: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'admin',
          username: 'admin',
          emailId: 'admin@app.com',
          password: 'password',
          isActive: '0',
          isLogin: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'user1',
          username: 'user1',
          emailId: 'user1@app.com',
          password: 'password',
          isActive: '0',
          isLogin: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullname: 'user2',
          username: 'user2',
          emailId: 'user2@app.com',
          password: 'password',
          isActive: '0',
          isLogin: '0',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )

    // Associate roles and permissions for each user
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: QueryTypes.SELECT },
    )

    if (users.length >= 4) {
      // Assign roles and permissions using the function
      await associateRolesAndPermissions(
        users[0],
        ['superadmin'],
        ['create-user', 'approve-user', 'buy-gold', 'access-scheme'],
      )
      await associateRolesAndPermissions(
        users[1],
        ['admin'],
        ['create-user', 'approve-user'],
      )
      await associateRolesAndPermissions(
        users[2],
        ['user'],
        ['buy-gold', 'access-scheme'],
      )
      await associateRolesAndPermissions(
        users[3],
        ['user'],
        ['buy-gold', 'access-scheme'],
      )
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  },
}
