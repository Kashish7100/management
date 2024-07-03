'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
    }
  }
  Profile.init(
    {
      userId: DataTypes.INTEGER,
      age: DataTypes.INTEGER,
      address: DataTypes.STRING,
      phoneNo: DataTypes.INTEGER,
      religion: DataTypes.STRING,
      sex: DataTypes.STRING,
      occupation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Profile',
    },
  )
  return Profile
}
