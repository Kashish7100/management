'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: 'UserRoles',
        foreignKey: 'userId',
        as: 'roles',
      })
      User.belongsToMany(models.Permission, {
        through: 'UserPermissions',
        foreignKey: 'userId',
        as: 'permissions',
      })
      User.hasOne(models.Profile, { foreignKey: 'userId', as: 'profile', })
    }

    static async login(emailId, password) {
      const user = await User.findOne({
        where: { emailId },
        include: [
          {
            model: sequelize.models.Role,
            as: 'roles',
            through: {
              attributes: [], // Exclude the join table attributes from the result
            },
            attributes: ['name'], // Only include the 'name' attribute of Role
          },
          {
            model: sequelize.models.Permission,
            as: 'permissions',
            through: {
              attributes: [], // Exclude the join table attributes from the result
            },
            attributes: ['name'], // Only include the 'name' attribute of Permission
          },
        ],
      })
      if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
          return user
        }
        throw new Error('Incorrect password')
      }
      throw new Error('Email not found')
    }
  }

  User.init(
    {
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      emailId: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isLogin: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user, options) => {
          const salt = await bcrypt.genSalt()
          user.password = await bcrypt.hash(user.password, salt)
        },
        beforeUpdate: async (user, options) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt()
            user.password = await bcrypt.hash(user.password, salt)
          }
        },
      },
    },
  )

  return User
}
