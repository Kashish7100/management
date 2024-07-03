const db = require('../models')
const User = db.User
const Role = db.Role
const Permission = db.Permission

const associateRolesAndPermissions = async (userRecord, roles, permissions) => {
  const rolesToAssociate = await Role.findAll({ where: { name: roles } })
  const permissionsToAssociate = await Permission.findAll({
    where: { name: permissions },
  })

  if (
    rolesToAssociate.length !== roles.length ||
    permissionsToAssociate.length !== permissions.length
  ) {
    logger.error('One or more Role or Permission not found')
    throw new Error('One or more Role or Permission not found')
  }

  const user = await User.findByPk(userRecord.id)
  if (user) {
    if (roles.length > 0) {
      await user.addRoles(rolesToAssociate)
    }
    if (permissions.length > 0) {
      await user.addPermission(permissionsToAssociate)
    }
  } else {
    console.log('User not found')
  }
}

module.exports = associateRolesAndPermissions
